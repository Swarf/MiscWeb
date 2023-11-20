import {MightDeck} from "./MightDecks";

export class DrawSimulator {
    #decks;
    redrawTokens;
    drawOnCrit;
    simStartCount = 200;
    simAcceleration = 2;
    maxSimulationTime = 12;
    #simResults;
    constructor(redrawTokens, drawOnCrit) {
        this.redrawTokens = redrawTokens;
        this.drawOnCrit = drawOnCrit;
        this.#simResults = new Array(100);
    }

    simulate(deckList) {
        let simulationCount = this.simStartCount;
        this.#simResults.fill(0);

        let redrawsUsed = 0;
        const start = performance.now();

        while (performance.now() - start < this.maxSimulationTime) {
            redrawsUsed += this.simulateBatch(deckList, simulationCount);
            simulationCount *= this.simAcceleration;
        }

        const simTime = performance.now() - start;
        return {
            results: this.#simResults,
            redrawsUsed: redrawsUsed,
            time: simTime
        }
    }

    simulateBatch(deckList, simulationCount) {
        let totalRedrawsUsed = 0;
        for (let i = 0; i < simulationCount; i++) {
            const [result, redrawsUsed] = this.simulateOnce(deckList);
            totalRedrawsUsed += redrawsUsed;
            this.#simResults[result]++;
        }

        return totalRedrawsUsed;
    }

    simulateOnce(deckList) {
        let misses = 0;
        let redrawsUsed = 0;
        let critDraw = false;
        let total = 0;
        let lastDeckCopy;
        const drawOnCrit = this.drawOnCrit; // cache this for the inner function

        function drawFrom(deck, isRedraw = false) {
            const card = deck.draw();

            if (card.value > 0) {
                total += card.value;
                if (isRedraw) misses--;

                critDraw = drawOnCrit && card.crit;
                while(critDraw) {
                    const extraCard = deck.draw();
                    total += extraCard.value;
                    critDraw = extraCard.crit;
                }
            } else {
                if (!isRedraw) misses++;
            }
        }

        for (const deckSetup of deckList) {
            const deckCopy = MightDeck.from(deckSetup['deck']);
            lastDeckCopy = deckCopy;

            for (let i = 0; i < deckSetup['draws']; i++) {
                drawFrom(deckCopy);
            }
        }

        if (misses > 1 && misses < this.redrawTokens + 2) {
            while(misses > 1 && redrawsUsed < this.redrawTokens) {
                redrawsUsed++;
                drawFrom(lastDeckCopy, true);
            }
        }

        return [misses > 1 ? 0 : total, redrawsUsed];
    }
}
