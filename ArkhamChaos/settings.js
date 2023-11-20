
import scenarios from './data/scenarios';

const arkhamdbToken = {
    skull: 'skull',
    cultist: 'cultist',
    tablet: 'tablet',
    elder_thing: 'squiddy'
};

export function setupSettings(element) {
    console.log(scenarios[0]);

    for (let card of scenarios) {
        if (card['traits'] && card['traits'].toLowerCase().includes('return.')) {
            continue;
        }

        const linesFront = card['text'].split('\n');
        if (linesFront[0] !== "Easy / Standard" && linesFront[0] !== "Standard") {
            if (linesFront[0].startsWith('Perform the setup')) {
                continue;
            }

            console.error(`Mismatch: ${card['name']} - ${linesFront[0]}`);
        }

        if (!card['double_sided']) {
            console.error(`${card['name']} is not double sided. code = ${card['code']}`);
            continue;
        }

        const linesBack = card['back_text'].split('\n');

        const rules = {};
        rules[linesFront[0]] = scenarioRulesFromCard(linesFront, card['url']);
        rules[linesBack[0]] = scenarioRulesFromCard(linesBack, card['url']);
        console.log(card['url']);
        console.log(rules);
    }

    if (!element) return;
    element.innerHTML = '<div>TBD</div>';



}

const tokenPatStr = '\\[([a-z_]+)]';
//                       modifier or redraw                          parens         every
const effectPattern = /^([-–X0-9+]+|Reveal another(?: chaos)? token)(\s+\([^)]+\))?(?: for (?:each|every) ([a-zA-Z0-9- \[\]]+))?\s?\./;
const altEffectPattern = /([-–X0-9+]+)(\s+\([^)]+\.\))?/;  // https://arkhamdb.com/card/02118 has period inside parens
const tokenPattern = new RegExp(tokenPatStr, 'g');
const linePattern = /^([^:]+)\s*:\s+(.+)$/;
const altLinePattern = new RegExp(`${tokenPatStr} (.+)$`);  // https://arkhamdb.com/card/01104
const parenEffectPattern = /([-–X0-9]+) instead if (.+)/;

function scenarioRulesFromCard(cardLines, url) {
    const cardRules = [];

    for (let i = 1; i < cardLines.length; i++) {
        if (!cardLines[i]) continue;
        let match;
        const tokens = [];
        let effectStr;
        if ((match = linePattern.exec(cardLines[i]))) {
            let tokenMatch;
            while ((tokenMatch = tokenPattern.exec(match[1]))) {
                tokens.push(arkhamdbToken[tokenMatch[1]]);
            }
            effectStr = match[2];
        } else if ((match = altLinePattern.exec(cardLines[i]))) {
            tokens.push(arkhamdbToken[match[1]]);
            effectStr = match[2];
        } else {
            console.error(`No scenario line match:  ${cardLines[i]}`, url);
            break;
        }

        match = effectPattern.exec(effectStr) || altEffectPattern.exec(effectStr);
        if (!match) {
            console.error(`No card effect match: ${effectStr}`, url);
            break;
        }

        let conditionalText, conditionalModifier;
        if (match[2]) {
            const parenMatch = parenEffectPattern.exec(match[2]);
            if (!parenMatch) {
                console.error(`No parenthetical match: ${match[2]}`, url);
            }

            conditionalModifier = parenMatch[1];
            conditionalText = parenMatch[2];
        }

        const modifierText = match[1].replace('–', '-');  // ArkhamDB is inconsistent
        let redraw = false;
        let modifier;
        let variable = false;

        if (modifierText.startsWith('Reveal')) {
            redraw = true;
            modifier = 0;
        } else if (modifierText.indexOf('X') > -1) {
            modifier = 0;
            variable = true;
        } else {
            modifier = parseInt(modifierText);
            if (match[3]) {
                variable = true;
            }
        }

        cardRules.push({
            tokens: tokens,
            redraw: redraw,
            variable: variable,
            modifier: modifier,
            conditionalModifier: conditionalModifier,
            conditionalText: conditionalText
        });
    }

    return cardRules;
}