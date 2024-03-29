
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
for (let i = 2; i >= -6; i--) numberViews.push(new TokenView(i));
numberViews.push(new TokenView(-8));

export const variableSymbols = [eldersign, skull, cultist, tablet, squiddy];
export const transientSymbols = [bless, curse, frost];

export function signedNumber(number) {
    return number > 0 ? `+${number}` : number;
}