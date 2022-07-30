import './style.css'
import './style_arkham.css'
import { setupCounter } from './counter.js'
import { setupChaosContents } from "./bag_contents";

document.querySelector('#app').innerHTML = `
  <div>
    <div class="calculator-view">
        <div class="card" id="contents-tracker">
            <p>foo</p>

        </div>
        <div class="card" id="chaos-outcomes">
            <p>bar</p>
        </div>
    </div>

    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
     <span class="icon-skull"></span>
  </div>
`;

setupCounter(document.querySelector('#counter'));
setupChaosContents(document.querySelector('#contents-tracker'));