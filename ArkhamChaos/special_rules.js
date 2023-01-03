
import { chaosBag } from "./chaos_bag";

export function setupSpecialRules(element) {
    element.innerHTML = '<span class="card-title"><h2>Extra Rules</h2></span>';

    element.innerHTML += `<div class="rules-row">
    <span class="rules-name">Ritual Candles</span>
    
</div>`;

    element.style.display = "inherit";
}