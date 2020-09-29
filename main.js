
let timer = null;
let intervalTime = null;

const naturals = "ABCDEFG".split('');
const flats = ["Ab", "Bb", "Db", "Eb", "Gb"].map((n) => n.replace('b', '<span class="music-symbol">♭</span>'));
const sharps = ["A#", "C#", "D#", "F#", "G#"].map((n) => n.replace('#', '<span class="music-symbol">♯</span>'));

function nextCard() {
    const cardSelectRadioButtons = document.querySelectorAll('input[name="card-select"]');
    let notes;
    cardSelectRadioButtons.forEach((el) => {
        if (el.checked) {
            switch (el.id) {
                case 'cards-accidental':
                    notes = flats.concat(sharps);
                    break;
                case 'cards-natural':
                    notes = naturals.concat();
                    break;
                case 'cards-both':
                    notes = naturals.concat(sharps, flats);
                    break;
            }
        }
    });

    let card = document.querySelector('.flash-card');
    // const notes = naturals.concat(flats, sharps);
    const oldIndex = notes.indexOf(card.innerHTML);
    if (oldIndex >= 0) {
        notes.splice(oldIndex, 1);
    }

    card.innerHTML = notes[Math.floor(Math.random() * notes.length)];

}

function startTimer() {
    if (timer) {
        clearTimeout(timer);
        nextCard();
    }

    timer = setTimeout(startTimer, intervalTime);
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
    document.querySelectorAll('button').forEach((button) => {
        if(button.id === 'next-card') {
            button.onclick = nextCard;
        }

        if (button.id === 'timer-start') {
            button.onclick = toggleTimer;
        }
    });

    const intervalSlider = document.querySelector('#interval-time');
    intervalTime = intervalSlider.value;
    intervalSlider.labels[0].innerHTML = timeDisplay(intervalTime);
    intervalSlider.addEventListener('input', (event) => {
        intervalTime = event.target.value;
        event.target.labels[0].innerHTML = timeDisplay(intervalTime);
    });

    const autoCheckbox = document.querySelector('#auto-select');
    if (autoCheckbox.checked) {
        startTimer();
    }
    autoCheckbox.addEventListener('change', toggleTimer);
}

document.addEventListener('DOMContentLoaded', setup, false);

