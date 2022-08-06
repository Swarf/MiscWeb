
import { chaosBag } from "./chaos_bag";
import { autofail, numberViews, transientSymbols, variableSymbols } from "./chaos_token_view";

export function setupChaosContents(element) {
    element.innerHTML = `<span class="card-title"><h2>Contents</></span>`;
    for (const token of [...transientSymbols, ...variableSymbols, autofail, ...numberViews]) {
        element.innerHTML += `<div class="token-row">
<span class="token-name">${token.html}</span>
<button data-token="${token.name}" class="minus-button"></button>
<span data-token="${token.name}" class="token-count">${chaosBag.getCount(token.name)}</span>
<button data-token="${token.name}" class="plus-button"></button>
</div>
`;
    }

    const minusAction = event => {
        const tokenName = event.target.getAttribute('data-token');
        const countEl = event.target.parentElement.querySelector(`.token-count[data-token="${tokenName}"]`);
        countEl.innerText = chaosBag.remove(tokenName);
    };
    element.querySelectorAll('button.minus-button').forEach(button => button.addEventListener('click', minusAction));

    const plusAction = event => {
        const tokenName = event.target.getAttribute('data-token');
        const countEl = event.target.parentElement.querySelector(`.token-count[data-token="${tokenName}"]`);
        countEl.innerText = chaosBag.add(tokenName);
    };
    element.querySelectorAll('button.plus-button').forEach(button => button.addEventListener('click', plusAction));
}
