
// TODO - read token data from json. Include fail_after, max, redraw, autofail

class ChaosBag
{
    #tokenValues;
    #tokenCounts;
    #terminalModifiers;
    #redrawTokens;
    #listeners;

    constructor(bagContents, tokenValues, redrawTokens)
    {
        this.#listeners = new Set();
        this.#tokenCounts = bagContents;
        this.#tokenValues = tokenValues;
        this.#tokenValues['autofail'] = -Infinity;
        this.#redrawTokens = new Set(redrawTokens);

        this.#updateValueCounts(false);
    }

    #updateValueCounts(store = true) {
        this.#terminalModifiers = [];

        for (const [token, count] of Object.entries(this.#tokenCounts)) {
            if (this.#redrawTokens.has(token)) continue;

            const value = token in this.#tokenValues ? this.#tokenValues[token] : parseInt(token);
            this.#terminalModifiers.push(...Array(count).fill(value));
        }

        this.#listeners.forEach(listener => setTimeout(listener));

        if (store) {
            try {
                localStorage.setItem("bagContents", JSON.stringify(this.#tokenCounts));
                localStorage.setItem("tokenValues", JSON.stringify(this.#tokenValues));
                localStorage.setItem("redrawTokens", JSON.stringify([...this.#redrawTokens]));
            } catch (err) {
                if (err instanceof DOMException) {
                    console.error(`Failed to write localStorage. ${err.name} (${err.code})`);
                }
            }
        }
    }

    bagSize() {
        return Object.values(this.#tokenCounts).reduce((prev, cur) => prev + cur, 0);
    }

    add(token)
    {
        if (token in this.#tokenCounts)
        {
            this.#tokenCounts[token]++;
        }
        else
        {
            this.#tokenCounts[token] = 1;
        }

        this.#updateValueCounts();
        return this.#tokenCounts[token];
    }

    remove(token)
    {
        if (token in this.#tokenCounts && this.#tokenCounts[token] > 0)
        {
            this.#tokenCounts[token]--;
        }

        this.#updateValueCounts();
        return this.getCount(token);
    }

    getCount(token) {
        return this.#tokenCounts[token] || 0;
    }

    getValue(token) {
        return this.#tokenValues[token];
    }

    isRedrawn(token) {
        return this.#redrawTokens.has(token);
    }

    setCount(token, count)
    {
        this.#tokenCounts[token] = count;
        this.#updateValueCounts();
    }

    setValue(token, value)
    {
        this.#tokenValues[token] = value;
        this.#updateValueCounts();
    }

    setRedraw(token, redraw)
    {
        if (redraw) {
            this.#redrawTokens.add(token);
        } else {
            this.#redrawTokens.delete(token);
        }
        this.#updateValueCounts();
    }

    onChange(callback) {
        this.#listeners.add(callback);
    }

    chance(lowSkill, highSkill, successThresholds) {
        // Determine how many tokens are terminal vs have redraws
        const terminalTokenCount = this.#terminalModifiers.length;
        let redrawTokenCount = 0;
        const redrawCountsObj = {};
        for (const token of this.#redrawTokens) {
            redrawTokenCount += this.getCount(token);
            if (this.getCount(token)) {
                redrawCountsObj[token] = this.getCount(token);
            }
        }
        const allTokenCount = terminalTokenCount + redrawTokenCount;

        // Calculate redraw impact
        const redrawEffects = {0: terminalTokenCount / allTokenCount};  // Start with the chance for no redraw tokens

        for (let redrawsBeforeTerm=1; redrawsBeforeTerm <= redrawTokenCount; redrawsBeforeTerm++) {
            // Calculate chance of this many general redraws
            // If there are 3 redraw tokens, 17 terminal tokens, and we're considering the case of 2 redraws pulled
            // Chance will be (3/20) * (2/19) * (17/18)
            let chance = terminalTokenCount / (allTokenCount - redrawsBeforeTerm);  // eg, 17/18 in ex
            for (let i=0; i<redrawsBeforeTerm; i++) {
                chance *= (redrawTokenCount - i) / (allTokenCount - i);
            }

            const allComboCount = binomial(redrawTokenCount, redrawsBeforeTerm);
            for (const combo of combinations(redrawCountsObj, redrawsBeforeTerm)) {
                let modifier = 0;
                let comboCount = 1;

                for (const [token, count] of Object.entries(combo)) {
                    modifier += this.#tokenValues[token] * count;
                    comboCount *= binomial(this.getCount(token), count);
                }

                redrawEffects[modifier] = (redrawEffects[modifier] || 0) + chance * comboCount / allComboCount;
            }
        }

        // For a range of test skill gaps, calculate the chance of success.
        const skillChances = {};

        for (const threshold of successThresholds) {
            skillChances[threshold] = [];

            for (let skill = lowSkill; skill <= highSkill; skill++) {
                const modifiedSuccesses = {};  // How many terminal tokens result in success, after redraw modifiers
                Object.keys(redrawEffects).forEach(k => modifiedSuccesses[k] = 0);
                for (const terminalModifier of this.#terminalModifiers) {
                    for (const redrawModifier of Object.keys(redrawEffects)) {
                        if (skill + parseInt(redrawModifier) + terminalModifier >= threshold) {
                            modifiedSuccesses[redrawModifier] += 1;
                        }
                    }
                }

                let totalChance = 0;
                for (const [redrawModifier, successes] of Object.entries(modifiedSuccesses)) {
                    totalChance += redrawEffects[redrawModifier] * successes / terminalTokenCount;
                }

                skillChances[threshold].push(Math.round(totalChance * 1000) / 10);
            }
        }

        const labels = [];
        for (let i = lowSkill; i <= highSkill; i++) {
            labels.push(i > 0 ? `+${i}` : i.toString());
        }

        return {labels: labels, chances: skillChances};
    }
}

function combinations(counts, numChosen) {
    const types = Object.keys(counts);

    // If only one type is left, resolve immediately
    if (types.length === 1) {
        return [{[types[0]]: numChosen}];
    }

    let combos = [];
    const countClone = Object.assign({}, counts);

    // For each type, use the type as the first element of combo, then recursively check combo without that element
    // Then remove that type and try same for the next type.
    types.sort();

    // If we're choosing just one, we can terminate here.
    if (numChosen === 1) {
        return types.map(tokenType => { return {[tokenType]: 1}; });
    }

    for (const tokenType of types) {
        const remaining = Object.values(countClone).reduce((prev, cur) => prev + cur, 0);
        if (remaining < numChosen) break;

        // We'll use one instance of the token type as our starter, then remove it from the list.
        if (--countClone[tokenType] === 0) {
            delete countClone[tokenType];
        }

        // For all the combos starting with this token instance, add to the list
        for (let combo of combinations(countClone, numChosen - 1)) {
            if (tokenType in combo) combo[tokenType]++;
            else combo[tokenType] = 1;

            combos.push(combo);
        }

        // Remove this type so we can try without it next pass
        delete countClone[tokenType];
    }

    return combos;
}

const pascalsTriangle = [[1]];
function binomial(n, k) {
    // If necessary, build out the Look Up Table
    while (n >= pascalsTriangle.length) {
        const lastIndex = pascalsTriangle.length;
        pascalsTriangle.push([1]);
        for (let i=1; i<lastIndex; i++) {
            pascalsTriangle[lastIndex][i] = pascalsTriangle[lastIndex-1][i-1] + pascalsTriangle[lastIndex-1][i];
        }
        pascalsTriangle[lastIndex].push(1);
    }

    // Return the lookup
    return pascalsTriangle[n][k];
}
// Help from https://stackoverflow.com/questions/37679987/efficient-computation-of-n-choose-k-in-node-js


function defaultBagSetup() {
    const tokenValues = {
        skull: -1,
        cultist: -2,
        tablet: -3,
        squiddy: -3,
        eldersign: 1,
        bless: 2,
        curse: -2,
        frost: -1,
        autofail: -Infinity
    };

    const bagContents = {
        skull: 2,
        cultist: 1,
        tablet: 1,
        squiddy: 1,
        eldersign: 1,
        autofail: 1,
        "+1": 1,
        "0": 2,
        "-1": 3,
        "-2": 2,
        "-3": 1,
        "-4": 1
    };
    const redrawTokens = ['bless', 'curse', 'frost'];

    return {
        bagContents: bagContents,
        tokenValues: tokenValues,
        redrawTokens: redrawTokens
    }
}

function loadBagSetup() {
    const params = {};

    for (let key of ['bagContents', 'tokenValues', 'redrawTokens']) {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            try {
                const parsedValue = JSON.parse(storedValue);
                if (parsedValue) {
                    params[key] = parsedValue;
                    continue;
                }
            } catch (err) {
                console.error(`Error parsing localStorage ${key}: ${err.message}`);
            }
        }

        return defaultBagSetup();
    }

    return params;
}

const setupParams = loadBagSetup();
export const chaosBag = new ChaosBag(
    setupParams.bagContents,
    setupParams.tokenValues,
    setupParams.redrawTokens
);
