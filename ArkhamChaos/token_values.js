
import { chaosBag } from "./chaos_bag";
import { variableSymbols, signedNumber } from "./chaos_token_view";

export function setupTokenValues(element) {
    element.innerHTML = `<span class="card-title"><h2>Modifier</h2></span>`;
    for (const token of variableSymbols) {
        const tokenValue = chaosBag.getValue(token.name);
        element.innerHTML += `<div class="token-row">
    <span class="token-name">${token.html}</span>
    <button data-token="${token.name}" class="minus-button"></button>
    <span data-token="${token.name}" class="token-value">${signedNumber(tokenValue)}</span>
    <button data-token="${token.name}" class="plus-button"></button>
    <span><input type="checkbox" /></span>
</div>`;

        const minusAction = event => {
            const tokenName = event.target.getAttribute('data-token');
            const valueEl = event.target.parentElement.querySelector(`.token-value[data-token="${tokenName}"]`);
            const tokenValue = parseInt(valueEl.innerText) - 1;
            chaosBag.setValue(tokenName, tokenValue);
            valueEl.innerText = signedNumber(tokenValue);
        };
        element.querySelectorAll('button.minus-button').forEach(button => button.addEventListener('click', minusAction));

        const plusAction = event => {
            const tokenName = event.target.getAttribute('data-token');
            const countEl = event.target.parentElement.querySelector(`.token-value[data-token="${tokenName}"]`);
            const tokenValue = parseInt(countEl.innerText) + 1;
            chaosBag.setValue(tokenName, tokenValue);
            countEl.innerText = signedNumber(tokenValue);
        };
        element.querySelectorAll('button.plus-button').forEach(button => button.addEventListener('click', plusAction));
    }
}