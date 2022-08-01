
import { chaosBag } from "./chaos_bag";

export function setupOutcomeView(element) {
    // chaosBag.setCount('frost', 4);
    chaosBag.setCount('bless', 4);
    chaosBag.setCount('curse', 2);
    element.innerHTML = `<p>${chaosBag.chance(0)}</p>`;

}