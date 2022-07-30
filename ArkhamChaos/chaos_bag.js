


class ChaosBag
{
    constructor()
    {
        this.tokenValues = {
            skull: -1,
            cultist: -2,
            tablet: -3,
            squiddy: -3,
            eldersign: 1,
            bless: 2,
            curse: -2,
            autofail: -99
        };
        this.numbers = [];
        for (let i = 1; i > -5; i--) this.numbers.push(i);

        this.tokenCounts = {
            skull: 2,
            cultist: 1,
            tablet: 1,
            squiddy: 1,
            eldersign: 1,
            autofail: 1,
            "+1": 1,
            "0": 2,
            "-1": 3,
            "-2": 2,
            "-3": 1,
            "-4": 1,
            bless: 0,
            curse: 0
        };
        this.redraw = new Set();
        this.redraw.add('bless');
        this.redraw.add('curse');
    }

    add(token)
    {
        if (token in this.tokenCounts)
        {
            this.tokenCounts[token]++;
        }
        else
        {
            this.tokenCounts[token] = 1;
        }
    }

    remove(token)
    {
        if (token in this.tokenCounts && this.tokenCounts[token] > 0)
        {
            this.tokenCounts[token]--;
        }
    }

    getCount(token) {
        return this.tokenCounts[token] || 0;
    }

    setCount(token, count)
    {
        this.tokenCounts[token] = count;
    }

    setValue(token, value)
    {
        this.tokenValues[token] = value;
    }

    setRedraw(token, redraw)
    {
        if (redraw) {
            this.redraw.add(token);
        } else {
            this.redraw.delete(token);
        }
    }
}

export const chaosBag = new ChaosBag();
