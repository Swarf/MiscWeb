
import { chaosBag } from "./chaos_bag";

class TokenView {
    constructor(name) {
        if (typeof name === 'number') {
            name = (name > 0 ? '+' : '') + name.toString();
        }
        this.name = name;
        this.html = isNaN(name) ? `<span class="icon-${this.name}"></span>` : this.name;
    }
}

const skull = new TokenView('skull');
const cultist = new TokenView('cultist');
const tablet = new TokenView('tablet');
const squiddy = new TokenView('squiddy');
const eldersign = new TokenView('eldersign');
export const autofail = new TokenView('autofail');
const bless = new TokenView('bless');
const curse = new TokenView('curse');
const frost = new TokenView('frost');

export const numberViews = [];
for (let x of chaosBag.numbers) {
    numberViews.push(new TokenView(x));
}

export const variableSymbols = [eldersign, skull, cultist, tablet, squiddy];
export const transientSymbols = [bless, curse, frost];

