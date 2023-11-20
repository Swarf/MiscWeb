

export class MightCard
{
    value;
    crit;

    constructor(value, crit=false) {
        this.value = value;
        this.crit = crit;
    }
}

export class MightDeck
{
    #cards;
    #critCount = null;
    #blankCount = null;
    name;

    constructor(name) {
        this.name = name;
        this.#cards = Array();
    }

    add(card, count) {
        for (let i = 0; i < count; i++) {
            this.#cards.push(card);
        }

        this.#critCount = null;
        this.#blankCount = null;
    }

    draw() {
        if (this.#cards.length === 0) {
            fillDeck(this);
        }

        const randIndex = Math.floor(Math.random() * this.#cards.length);
        return this.#splice(randIndex);
    }

    remove(value) {
        for (let i = 0; i < this.#cards.length; i++) {
            if (this.#cards[i].value === value) {
                return this.#splice(i);
            }
        }

        return null;
    }

    removeNonBlank() {
        for (let i = 0; i < this.#cards.length; i++) {
            if (this.#cards[i].value !== 0) {
                return this.#splice(i);
            }
        }

        return null;
    }

    #splice(index) {
        this.#critCount = null;
        this.#blankCount = null;
        return this.#cards.splice(index, 1)[0];
    }

    toString() {
        return this.#cards.map(card => card.crit ? `(${card.value})` : card.value).join(', ');
    }

    average() {
        return this.#cards.reduce((total, cur) => cur.value + total, 0) / this.#cards.length;
    }

    size() {
        return this.#cards.length;
    }

    blanks() {
        if (this.#blankCount === null) {
            this.#blankCount = this.#cards.filter(x => x.value === 0).length;
        }
        return this.#blankCount;
    }

    crits() {
        if (this.#critCount === null) {
            this.#critCount = this.#cards.filter(x => x.crit).length
        }
        return this.#critCount;
    }

    static from(deck) {
        const newDeck = new MightDeck(deck.name);
        newDeck.#cards = Array.from(deck.#cards);
        return newDeck;
    }
}

export function freshDeck(name) {
    let deck = new MightDeck(name);
    fillDeck(deck);
    return deck;
}

function fillDeck(deck) {
    deck.add(new MightCard(0), 6);

    switch (deck.name) {
        case 'white':
            deck.add(new MightCard(1), 6);
            deck.add(new MightCard(2), 3);
            deck.add(new MightCard(2, true), 3);
            break;

        case 'yellow':
            deck.add(new MightCard(1), 3);
            deck.add(new MightCard(2), 3);
            deck.add(new MightCard(3), 3);
            deck.add(new MightCard(3, true), 3);
            break;

        case 'red':
            deck.add(new MightCard(2), 3);
            deck.add(new MightCard(3), 6);
            deck.add(new MightCard(4, true), 3);
            break;

        case 'black':
            deck.add(new MightCard(3), 6);
            deck.add(new MightCard(4), 3);
            deck.add(new MightCard(5, true), 3);
            break;

        default:
            console.error('Bad deck name: ' + name);
    }
}


