import './style.css'
import './style_arkham.css'
import { setupChaosContents } from "./bag_contents";

document.querySelector('#app').innerHTML = `
  <div>
    <div class="calculator-view">
        <div class="card" id="contents-tracker">
        </div>
        <div class="card" id="chaos-outcomes">
            <p>bar</p>
        </div>
    </div>



  </div>
`;

setupChaosContents(document.querySelector('#contents-tracker'));