
// TODO - read token data from json. Include fail_after, max, redraw, autofail

class ChaosBag
{
    #tokenValues;
    #tokenCounts;
    #terminalModifiers;
    #redrawTokens;

    constructor()
    {
        this.#tokenValues = {
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
        this.numbers = [];
        for (let i = 1; i > -5; i--) this.numbers.push(i);

        this.#tokenCounts = {
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
        this.#redrawTokens = new Set();
        this.#redrawTokens.add('bless');
        this.#redrawTokens.add('curse');
        this.#redrawTokens.add('frost');

        this.#updateValueCounts();
    }

    #updateValueCounts() {
        this.#terminalModifiers = [];

        for (const [token, count] of Object.entries(this.#tokenCounts)) {
            if (this.#redrawTokens.has(token)) continue;

            const value = token in this.#tokenValues ? this.#tokenValues[token] : parseInt(token);
            this.#terminalModifiers.push(...Array(count).fill(value));
        }
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

    chance(succeedBy) {
        // Determine the largest and smallest tokens so we have a good range of skill gaps to cover
        let lowModifier = false;
        let highModifier = false;

        for (const modifier of this.#terminalModifiers) {
            if (!isFinite(modifier)) continue;
            if (lowModifier === false || modifier < lowModifier) lowModifier = modifier;
            if (highModifier === false || modifier > highModifier) highModifier = modifier;
        }

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
        for (let redrawsBeforeTerm=1; redrawsBeforeTerm <= redrawTokenCount; redrawsBeforeTerm++) {
            // Calculate chance of this many general redraws
            // If there are 3 redraw tokens, 17 terminal tokens, and we're considering the case of 2 redraws pulled
            // Chance will be (3/20) * (2/19) * (17/18)
            let chance = terminalTokenCount / (allTokenCount - redrawsBeforeTerm);  // eg, 17/18 in ex
            for (let i=0; i<redrawsBeforeTerm; i++) {
                chance *= (redrawTokenCount - i) / (allTokenCount - i);
            }

            console.log(redrawsBeforeTerm, chance);
            for (const combo of combinations(redrawCountsObj, redrawsBeforeTerm)) {
                console.log(combo);
            }
        }

        // console.log(combinations(redrawCountsObj, 3));

        return this.#terminalModifiers.toString();
    }
}

function combinations(counts, numChosen) {
    const types = Object.keys(counts);

    // If only one type is left, resolve immediately
    if (types.length === 1) {
        return [Array(numChosen).fill(types[0])];
    }

    let combos = [];
    const countClone = Object.assign({}, counts);

    // For each type, use the type as the first element of combo, then recursively check combo without that element
    // Then remove that type and try same for the next type.
    types.sort();

    // If we're choosing just one, we can terminate here.
    if (numChosen === 1) {
        return types.map(tokenType => [tokenType]);
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
            combos.push([tokenType, ...combo]);
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

export const chaosBag = new ChaosBag();
