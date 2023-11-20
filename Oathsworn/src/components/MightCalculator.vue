<template>
    <div class="calculator">
        <h2>Calculator</h2>
    </div>
</template>

<script>
    import {freshDeck, MightCard, MightDeck} from './MightDecks';
    import {atMostBlanks, drawCountProb} from "./MightMath";
    import {DrawSimulator} from "./Simulate";

    let deck = freshDeck('white');

    const draws = 4;
    const useRedraw = true;

    // Calculate exact chance of non-misses
    // let chanceOfOneBlank = choose(deck.blanks(), 1) * choose(deck.size() - deck.blanks(), draws - 1) / choose(deck.size(), draws);
    let oneBlankOrLess = atMostBlanks(deck, draws, 1);
    console.log(`For ${draws} draw${draws > 1 ? 's' : ''}`);
    console.log(`Initial success = ${oneBlankOrLess.toFixed(4) * 100}%`);

    let successChance = oneBlankOrLess;

    const chanceTwoBlanks = drawCountProb(deck.blanks(), deck.size(), draws, 2);
    console.log('exactly 2 blanks', chanceTwoBlanks);
    if (chanceTwoBlanks > 0 && useRedraw) {
        const chancePassOnRedraw = drawCountProb(deck.size() - deck.blanks() - draws + 2, deck.size() - draws, 1, 1);
        console.log('chance redraw gets non-blank', chancePassOnRedraw);
        successChance = oneBlankOrLess + chanceTwoBlanks * chancePassOnRedraw;
    }

    console.log(`success chance = ${successChance.toFixed(4) * 100}%`);


    // Run simulations
    const simulator = new DrawSimulator(0, true);
    const simResult = simulator.simulate([{deck: deck, draws: draws}]);
    const results = simResult['results'];

    let simsRun = 0;
    let sum = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i]) {
        simsRun += results[i];
        sum += results[i] * i;

        // console.log(`${i}\t${results[i]}`);
      }
    }

    console.log(`Expectation: ${(sum / simsRun).toFixed(2)} from ${simsRun} runs in ${simResult['time'].toFixed(2)} ms`);
    console.log(`Success chance ${(1 - results[0] / simsRun).toFixed(4) * 100}% using avg of ${simResult['redrawsUsed'] / simsRun} redraws`);

    const test = 5;


</script>

<style scoped>

</style>