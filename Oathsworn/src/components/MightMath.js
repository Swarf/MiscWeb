

export function atMostBlanks(deck, draws, blanks) {
    let prob = 0;
    for (let targetCount = 0; targetCount <= blanks; targetCount++) {
        prob += drawCountProb(deck.blanks(), deck.size(), draws, targetCount);
    }
    return prob;
}

export function drawCountProb(targetsInDeck, deckSize, draws, targetCount) {
    if (targetCount > draws) return 0;
    return choose(targetsInDeck, targetCount) * choose(deckSize - targetsInDeck, draws - targetCount) / choose(deckSize, draws);
}

const pascalsTriangle = [[1]];
function choose(n, k) {
    // If necessary, build out the binomial table
    while (n >= pascalsTriangle.length) {
        const lastIndex = pascalsTriangle.length;
        pascalsTriangle.push([1]);
        for (let i=1; i<lastIndex; i++) {
            pascalsTriangle[lastIndex][i] = pascalsTriangle[lastIndex-1][i-1] + pascalsTriangle[lastIndex-1][i];
        }
        pascalsTriangle[lastIndex].push(1);
    }

    // Return the lookup
    return pascalsTriangle[n][k];
}
// Help from https://stackoverflow.com/questions/37679987/efficient-computation-of-n-choose-k-in-node-js
