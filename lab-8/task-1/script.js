// --- КОНСТАНТИ ТА ДАНІ ---
const CARD_BACK = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg";
const CARD_IMAGES = [
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg"
];

const DIFFICULTY_TIMES = { easy: 180, normal: 120, hard: 60 };

// --- СТАН (STATE) ---
let state = {
    settings: { players: 1, size: 16, difficulty: 'easy', totalRounds: 1 },
    game: {
        status: 'idle', // idle, playing, paused, finished
        currentRound: 1,
        timeLeft: 180,
        cards: [],
        flippedIds: [],
        isLocked: false
    },
    players: [
        { id: 1, name: "Гравець 1", moves: 0, matches: 0, roundStats: [] },
        { id: 2, name: "Гравець 2", moves: 0, matches: 0, roundStats: [] }
    ],
    currentPlayerIndex: 0
};

let timerInterval = null;

// --- PURE FUNCTIONS ---
const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const createDeck = (size) => {
    const pairs = CARD_IMAGES.slice(0, size / 2);
    return shuffle([...pairs, ...pairs]).map((url, idx) => ({
        id: idx, url, isFlipped: false, isMatched: false
    }));
};

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

// Редюсер для чистих змін стану
const reducer = (prevState, action) => {
    const s = JSON.parse(JSON.stringify(prevState)); // Глибока копія для чистоти

    switch (action.type) {
        case 'START_GAME':
            s.settings = { ...action.payload.settings };
            s.game = {
                status: 'playing',
                currentRound: 1,
                timeLeft: DIFFICULTY_TIMES[s.settings.difficulty],
                cards: createDeck(s.settings.size),
                flippedIds: [],
                isLocked: false
            };
            s.players = action.payload.players.map(p => ({ ...p, moves: 0, matches: 0, roundStats: [] }));
            s.currentPlayerIndex = 0;
            return s;

        case 'FLIP_CARD':
            if (s.game.isLocked || s.game.status !== 'playing') return prevState;
            const card = s.game.cards.find(c => c.id === action.payload);
            if (card.isFlipped || card.isMatched) return prevState;

            card.isFlipped = true;
            s.game.flippedIds.push(card.id);
            s.players[s.currentPlayerIndex].moves++;
            if (s.game.flippedIds.length === 2) s.game.isLocked = true;
            return s;

        case 'CHECK_MATCH':
            const [id1, id2] = s.game.flippedIds;
            const c1 = s.game.cards.find(c => c.id === id1);
            const c2 = s.game.cards.find(c => c.id === id2);

            if (c1.url === c2.url) {
                c1.isMatched = true;
                c2.isMatched = true;
                s.players[s.currentPlayerIndex].matches++;
            } else {
                c1.isFlipped = false;
                c2.isFlipped = false;
                if (s.settings.players === 2) {
                    s.currentPlayerIndex = s.currentPlayerIndex === 0 ? 1 : 0; // Передача ходу
                }
            }
            s.game.flippedIds = [];
            s.game.isLocked = false;

            // Перевірка завершення раунду
            if (s.game.cards.every(c => c.isMatched)) {
                s.game.status = 'paused';
                const timeSpent = DIFFICULTY_TIMES[s.settings.difficulty] - s.game.timeLeft;
                s.players.forEach(p => {
                    p.roundStats.push({ moves: p.moves, matches: p.matches, time: timeSpent });
                    p.moves = 0; p.matches = 0; // Скидання для наступного
                });
            }
            return s;

        case 'TICK_TIMER':
            if (s.game.timeLeft > 0 && s.game.status === 'playing') {
                s.game.timeLeft--;
            } else if (s.game.timeLeft === 0 && s.game.status === 'playing') {
                s.game.status = 'paused'; // Час вийшов
            }
            return s;

        case 'NEXT_ROUND':
            s.game.currentRound++;
            s.game.timeLeft = DIFFICULTY_TIMES[s.settings.difficulty];
            s.game.cards = createDeck(s.settings.size);
            s.game.flippedIds = [];
            s.game.status = 'playing';
            s.currentPlayerIndex = 0;
            return s;

        default: return prevState;
    }
};

// --- DOM МАНІПУЛЯЦІЇ (РЕНДЕР) ---
const render = () => {
    // UI Статистика
    document.getElementById('ui-round').innerText = `${state.game.status !== 'idle' ? state.game.currentRound : 0} / ${state.settings.totalRounds}`;
    document.getElementById('ui-timer').innerText = formatTime(state.game.timeLeft);
    document.getElementById('ui-current-player').innerText = state.game.status !== 'idle' ? state.players[state.currentPlayerIndex].name : '-';

    // Ходи гравців
    document.getElementById('p1-stats').innerText = `${state.players[0].name} - Ходів: ${state.players[0].moves} (Знайдено: ${state.players[0].matches})`;
    if (state.settings.players === 2) {
        document.getElementById('p2-stats').classList.remove('hidden');
        document.getElementById('p2-stats').innerText = `${state.players[1].name} - Ходів: ${state.players[1].moves} (Знайдено: ${state.players[1].matches})`;
    } else {
        document.getElementById('p2-stats').classList.add('hidden');
    }

    // Кнопки
    document.getElementById('btn-start').disabled = state.game.status !== 'idle';
    document.getElementById('btn-restart').disabled = state.game.status === 'idle';

    // Ігрове поле
    const board = document.getElementById('game-board');
    if (state.game.status === 'idle') {
        board.innerHTML = '';
        delete board.dataset.round; // Очищаємо пам'ять про раунд при скиданні
        return;
    }

    // ФІКС 1: Перевіряємо не тільки кількість карток, а й чи змінився раунд!
    // Якщо раунд змінився, ми ПОВНІСТЮ перемальовуємо HTML, щоб підтягнулися нові картинки.
    if (board.children.length !== state.game.cards.length || board.dataset.round !== String(state.game.currentRound)) {
        const cols = state.settings.size / 4;
        board.style.gridTemplateColumns = `repeat(${cols}, 90px)`;
        board.dataset.round = state.game.currentRound; // Запам'ятовуємо, який раунд відрендерили

        board.innerHTML = state.game.cards.map(card => `
            <div class="card" data-id="${card.id}">
                <div class="card-inner">
                    <div class="card-front"><img src="${CARD_BACK}" alt="back"></div>
                    <div class="card-back"><img src="${card.url}" alt="front"></div>
                </div>
            </div>
        `).join('');
    }

    // ФІКС 2: Оновлюємо класи (додаємо зняття класу matched)
    state.game.cards.forEach(card => {
        const cardEl = board.querySelector(`.card[data-id="${card.id}"]`);
        if (cardEl) {
            // Перегортання
            if (card.isFlipped || card.isMatched) {
                cardEl.classList.add('flipped');
            } else {
                cardEl.classList.remove('flipped');
            }

            // Окантовка знайдених (додали else з remove)
            if (card.isMatched) {
                cardEl.classList.add('matched');
            } else {
                cardEl.classList.remove('matched');
            }
        }
    });

    checkGameEnd();
};

const checkGameEnd = () => {
    if (state.game.status !== 'paused') return;

    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const btn = document.getElementById('btn-next-action');

    clearInterval(timerInterval);

    if (state.game.timeLeft === 0 && !state.game.cards.every(c => c.isMatched)) {
        title.innerText = "Час вийшов!";
        body.innerHTML = "<p>Спробуйте ще раз.</p>";
        btn.innerText = "Закрити";
        btn.onclick = () => { modal.classList.add('hidden'); state.game.status = 'idle'; render(); };
    }
    else if (state.game.currentRound < state.settings.totalRounds) {
        title.innerText = `Раунд ${state.game.currentRound} завершено!`;
        body.innerHTML = `<p>Підготовка до наступного раунду...</p>`;
        btn.innerText = "Наступний раунд";
        btn.onclick = () => {
            modal.classList.add('hidden');
            dispatch({ type: 'NEXT_ROUND' });
            startTimer();
        };
    }
    else {
        title.innerText = "Гру завершено!";
        let statsHTML = '';
        state.players.slice(0, state.settings.players).forEach(p => {
            statsHTML += `<h3>${p.name}</h3>`;
            p.roundStats.forEach((rs, i) => {
                statsHTML += `<p>Раунд ${i+1}: ${rs.moves} ходів, ${rs.matches} пар, ${formatTime(rs.time)}</p>`;
            });
            const totalMatches = p.roundStats.reduce((sum, r) => sum + r.matches, 0);
            statsHTML += `<strong>Загалом знайдено пар: ${totalMatches}</strong><hr>`;
        });
        body.innerHTML = statsHTML;
        btn.innerText = "Завершити";
        btn.onclick = () => { modal.classList.add('hidden'); state.game.status = 'idle'; render(); };
    }

    modal.classList.remove('hidden');
};

const dispatch = (action) => {
    state = reducer(state, action);
    render();

    if (action.type === 'FLIP_CARD' && state.game.flippedIds.length === 2) {
        setTimeout(() => dispatch({ type: 'CHECK_MATCH' }), 1000);
    }
};

const startTimer = () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
        if (state.game.timeLeft === 0) clearInterval(timerInterval);
    }, 1000);
};

// --- EVENTS ---
document.getElementById('players-count').addEventListener('change', (e) => {
    const p2Input = document.getElementById('p2-name');
    e.target.value === '2' ? p2Input.classList.remove('hidden') : p2Input.classList.add('hidden');
});

document.getElementById('btn-start').addEventListener('click', () => {
    const settings = {
        players: parseInt(document.getElementById('players-count').value),
        size: parseInt(document.getElementById('grid-size').value),
        difficulty: document.getElementById('difficulty').value,
        totalRounds: parseInt(document.getElementById('rounds-count').value)
    };
    const players = [
        { id: 1, name: document.getElementById('p1-name').value || "Гравець 1" },
        { id: 2, name: document.getElementById('p2-name').value || "Гравець 2" }
    ];

    dispatch({ type: 'START_GAME', payload: { settings, players } });
    startTimer();
});

document.getElementById('btn-restart').addEventListener('click', () => {
    clearInterval(timerInterval);
    state.game.status = 'idle';
    render();
});

document.getElementById('btn-reset').addEventListener('click', () => {
    document.getElementById('players-count').value = '1';
    document.getElementById('p2-name').classList.add('hidden');
    document.getElementById('grid-size').value = '16';
    document.getElementById('difficulty').value = 'easy';
    document.getElementById('rounds-count').value = '1';
    document.getElementById('p1-name').value = 'Гравець 1';
    document.getElementById('p2-name').value = 'Гравець 2';
});

// Делегування подій на клік по картці
document.getElementById('game-board').addEventListener('click', (e) => {
    const cardEl = e.target.closest('.card');
    if (cardEl) {
        dispatch({ type: 'FLIP_CARD', payload: parseInt(cardEl.dataset.id) });
    }
});

// Init
render();