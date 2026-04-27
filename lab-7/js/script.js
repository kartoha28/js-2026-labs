'use strict';

/*  1. DOM Elements & State */

const elements = {
    menu: document.querySelector('.game-menu'),
    wrapper: document.querySelector('.wrapper'),
    panels: document.querySelector('.game-panels'),
    screen: document.querySelector('.game-screen'),
    winScreen: document.querySelector('.win-screen'),
    gunman: document.querySelector('.gunman'),
    message: document.querySelector('.message'),
    timeYou: document.querySelector('.time-panel__you'),
    timeGunman: document.querySelector('.time-panel__gunman'),
    score: document.querySelector('.score-panel__score_num'),
    level: document.querySelector('.score-panel__level'),
    restartBtn: document.querySelector('.button-restart'),
    nextLevelBtn: document.querySelector('.button-next-level'),
    startBtn: document.querySelector('.button-start-game')
};

let state = {
    level: 1,
    score: 0,
    gunmanTime: 1.50,
    isRoundActive: false,
    timerId: null,
    duelTimeoutId: null,
    startTime: 0,
    bgMusic: null
};

/* 2. Pure Function  */

const calcNewGunmanTime = (currentTime) => Math.max(0.20, currentTime - 0.10);
const calcScore = (currentScore, level) => currentScore + (level * 100);
const formatTime = (ms) => (ms / 1000).toFixed(2);

/*  3. Audio */

function playAudio(src, loop = false) {
    const audio = new Audio(`sfx/${src}`);
    audio.loop = loop;
    audio.play().catch(err => console.log('Аудіо заблоковано браузером:', err));
    return audio;
}

/* 4. Game logic */

function startGame() {
    elements.menu.style.display = 'none';
    elements.wrapper.style.display = 'block';
    elements.panels.style.display = 'block';
    elements.screen.style.display = 'block';

    playAudio('intro.m4a');

    state.level = 1;
    state.score = 0;
    state.gunmanTime = 1.50;

    updateUI();
    startRound();
}

function restartGame() {
    elements.restartBtn.style.display = 'none';
    elements.screen.classList.remove('game-screen--death');

    startGame();
}

function nextLevel() {
    elements.nextLevelBtn.style.display = 'none';

    state.level += 1;
    state.gunmanTime = calcNewGunmanTime(state.gunmanTime);

    updateUI();
    startRound();
}

function startRound() {
    elements.message.style.display = 'none';
    elements.message.className = 'message';

    elements.gunman.className = 'gunman gunman-level-1';

    if (state.bgMusic) state.bgMusic.pause();
    state.bgMusic = playAudio('wait.m4a', true);

    setTimeout(moveGunman, 50);
}

function moveGunman() {
    elements.gunman.classList.add('moving');

    setTimeout(() => {
        elements.gunman.classList.remove('moving');
        elements.gunman.classList.add('standing');
        elements.gunman.classList.add('gunman-level-1__standing');
        prepareForDuel();
    }, 5000);
}

function prepareForDuel() {
    const delay = Math.floor(Math.random() * 3000) + 2000;

    state.duelTimeoutId = setTimeout(() => {
        if (state.bgMusic) state.bgMusic.pause();
        playAudio('fire.m4a');

        elements.message.className = 'message message--fire';
        elements.message.style.display = 'block';
        elements.message.textContent = '';

        elements.gunman.classList.remove('gunman-level-1__standing');
        elements.gunman.classList.add('gunman-level-1__ready');

        timeCounter();
    }, delay);
}

function timeCounter() {
    state.isRoundActive = true;
    state.startTime = Date.now();

    state.timerId = setTimeout(() => {
        if (state.isRoundActive) {
            gunmanShootsPlayer();
        }
    }, state.gunmanTime * 1000);
}

function gunmanShootsPlayer() {
    state.isRoundActive = false;

    elements.gunman.classList.remove('gunman-level-1__ready');
    elements.gunman.classList.add('gunman-level-1__shooting');

    playAudio('death.m4a');

    elements.message.className = 'message message--dead';
    elements.message.innerHTML = `YOU LOSE<br>Total: $${state.score}`;
    elements.message.style.display = 'block';

    elements.screen.classList.add('game-screen--death');
    elements.restartBtn.style.display = 'block';
    elements.timeYou.textContent = "XXX";
}

function playerShootsGunman() {
    // ЗАХИСТ ВІД ЗАЙВИХ КЛІКІВ:
    // Якщо гра вже закінчилася (видно кнопку Restart або Next Level), ігноруємо всі подальші кліки
    if (elements.restartBtn.style.display === 'block' || elements.nextLevelBtn.style.display === 'block') {
        return;
    }

    // Перевірка на "фол" (клік до появи FIRE)
    if (!state.isRoundActive && elements.gunman.classList.contains('standing') && !elements.gunman.classList.contains('gunman-level-1__ready')) {

        // Зупиняємо таймер появи напису "FIRE!!!"
        clearTimeout(state.duelTimeoutId);

        // ЗВЕРНИ УВАГУ: Ми більше НЕ видаляємо клас 'standing', щоб він не починав знову йти!

        playAudio('foul.m4a');
        elements.message.className = 'message message--dead';
        elements.message.textContent = 'FOUL!';
        elements.message.style.display = 'block';

        elements.nextLevelBtn.style.display = 'none';
        elements.restartBtn.style.display = 'block';
        return;
    }

    // Якщо гравець клікнув вчасно (Перемога)
    if (state.isRoundActive) {
        state.isRoundActive = false;
        clearTimeout(state.timerId); // Зупиняємо постріл комп'ютера

        const reactionTimeMs = Date.now() - state.startTime;
        elements.timeYou.textContent = formatTime(reactionTimeMs);

        // Ось тут ми знімаємо стійку і додаємо смерть
        elements.gunman.classList.remove('gunman-level-1__ready');
        elements.gunman.classList.remove('standing'); // Тепер можна знімати, бо анімація смерті переб'є ходьбу
        elements.gunman.classList.add('gunman-level-1__death');

        playAudio('shot.m4a');
        setTimeout(() => playAudio('shot-fall.m4a'), 300);
        setTimeout(() => playAudio('win.m4a'), 1000);

        elements.message.className = 'message message--win';
        elements.message.textContent = 'YOU WIN';
        elements.message.style.display = 'block';

        scoreCount();

        elements.restartBtn.style.display = 'none';
        elements.nextLevelBtn.style.display = 'block';
    }
}

function scoreCount() {
    state.score = calcScore(state.score, state.level);
    elements.score.textContent = state.score;
}

function updateUI() {
    elements.level.textContent = `Level ${state.level}`;
    elements.timeGunman.textContent = state.gunmanTime.toFixed(2);
    elements.score.textContent = state.score;
    elements.timeYou.textContent = "0.00";
}

/* 5. EVENT LISTENERS  */

elements.startBtn.addEventListener('click', startGame);
elements.restartBtn.addEventListener('click', restartGame);
elements.nextLevelBtn.addEventListener('click', nextLevel);
elements.gunman.addEventListener('mousedown', playerShootsGunman);