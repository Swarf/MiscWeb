
import { chaosBag } from "./chaos_bag";
import { autofail, numberViews, transientSymbols, variableSymbols } from "./chaos_token_view";

const alwaysShowTokens = [...transientSymbols, ...variableSymbols.slice(0, 3)];  // First three of other symbols
let collapsed = true;
const extendedRows = [];

export function setupChaosContents(element) {
    element.innerHTML = `<span class="card-title"><h2>Contents</></span>`;

    for (const token of [...transientSymbols, ...variableSymbols, autofail, ...numberViews]) {
        element.innerHTML += `<div class="token-row ${alwaysShowTokens.indexOf(token) < 0 ? 'contents-collapsed' : ''}">
<span class="token-name">${token.html}</span>
<button data-token="${token.name}" class="minus-button"></button>
<span data-token="${token.name}" class="token-count">${chaosBag.getCount(token.name)}</span>
<button data-token="${token.name}" class="plus-button"></button>
</div>
`;
    }
    element.innerHTML += `<div class="contents-counts-row contents-collapsed"><span><label id="bag-size">${chaosBag.bagSize()}</label><label>tokens</label></span></div>`;
    element.innerHTML += `<div><button id="contents-expand">more</button></div>`;

    const minusAction = event => {
        const tokenName = event.target.getAttribute('data-token');
        const countEl = event.target.parentElement.querySelector(`.token-count[data-token="${tokenName}"]`);
        countEl.innerText = chaosBag.remove(tokenName);
        document.getElementById('bag-size').innerText = chaosBag.bagSize();
    };
    element.querySelectorAll('button.minus-button').forEach(button => button.addEventListener('click', minusAction));

    const plusAction = event => {
        const tokenName = event.target.getAttribute('data-token');
        const countEl = event.target.parentElement.querySelector(`.token-count[data-token="${tokenName}"]`);
        countEl.innerText = chaosBag.add(tokenName);
        document.getElementById('bag-size').innerText = chaosBag.bagSize();
    };
    element.querySelectorAll('button.plus-button').forEach(button => button.addEventListener('click', plusAction));

    element.querySelectorAll('div.token-row').forEach(row => {
            if(row.classList.contains('contents-collapsed')) extendedRows.push(row)
        });
    extendedRows.push(element.querySelector('div.contents-counts-row'));

    const moreLessAction = event => {
        collapsed = !collapsed;

        for (const row of extendedRows) row.classList.toggle('contents-collapsed');
        event.target.innerHTML = event.target.innerHTML === 'more' ? 'less' : 'more';
    };
    document.getElementById('contents-expand').addEventListener("click", moreLessAction);
}
