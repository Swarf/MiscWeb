
let timer = null;
let interval = null;

function nextCard() {
    let card = document.querySelector('.flash-card');
    const notes = 'ABCDEFG'.split('');
    const oldIndex = notes.indexOf(card.innerHTML);
    if (oldIndex >= 0) {
        notes.splice(oldIndex, 1);
    }

    card.innerHTML = notes[Math.floor(Math.random() * notes.length)];
}

function startTimer() {
    if (timer) {
        nextCard();
    }

    timer = setTimeout(startTimer, interval);
}

function toggleTimer() {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    } else {
        startTimer();
    }
}

function timeDisplay(timeVal) {
    return (timeVal / 1000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function setup() {
    console.log('foo');
    document.querySelectorAll('button').forEach((button) => {
        if(button.id === 'next-card') {
            button.onclick = nextCard;
        }

        if (button.id === 'timer-start') {
            button.onclick = toggleTimer;
        }
    });

    const intervalSlider = document.querySelector('#interval');
    interval = intervalSlider.value;
    intervalSlider.labels[0].innerHTML = timeDisplay(interval);
    intervalSlider.addEventListener('input', (event) => {
        interval = event.target.value;
        event.target.labels[0].innerHTML = timeDisplay(interval);
    });
}

document.addEventListener('DOMContentLoaded', setup, false);

