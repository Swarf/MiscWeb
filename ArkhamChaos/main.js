import './style.css'
import './style_arkham.css'
import { setupChaosContents } from "./bag_contents";
import { setupOutcomeView } from "./outcomes";
import { setupTokenValues } from "./token_values";
import { setupSpecialRules} from "./special_rules";

document.querySelector('#app').innerHTML = `
  <div>
    <div class="calculator-view">
        <div><div class="card" id="contents-tracker"></div></div>
        <div id="chaos-outcomes"></div>
        <div><div class="card" id="token-values"></div></div>
<!--        <div><div class="card" id="special-rules"></div></div>-->
    </div>
  </div>
`;

setupChaosContents(document.getElementById('contents-tracker'));
setupOutcomeView(document.getElementById('chaos-outcomes'));
setupTokenValues(document.getElementById('token-values'));
setupSpecialRules(document.getElementById('special-rules'));
