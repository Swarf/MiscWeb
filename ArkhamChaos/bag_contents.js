

import { chaosBag } from "./chaos_bag";
import { autofail, numberViews, transientSymbols, variableSymbols } from "./chaos_token_view";

export function setupChaosContents(element) {
    let html = '';

    for (let token of [...transientSymbols, ...variableSymbols, autofail, ...numberViews]) {
        html += `<div>
<span class="token-name">${token.html}</span>
<button class="plus-minus-button minus-button"></button>
<span class="token-count">${chaosBag.getCount(token.name)}</span>
<button class="plus-minus-button plus-button"></button>
</div>
`;
    }


    element.innerHTML = html;

}