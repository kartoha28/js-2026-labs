// Завдання 1: Лампочка
const bulb = document.getElementById('bulb');
const toggleBtn = document.getElementById('toggleBtn');
const typeSelect = document.getElementById('bulbType');
const brightnessBtn = document.getElementById('brightnessBtn');
let inactivityTimer;

//таймер виключення
function resetBulbTimer() {
    clearTimeout(inactivityTimer);
    if (!bulb.classList.contains('off')) {
        inactivityTimer = setTimeout(() => {
            bulb.classList.add('off');
            toggleBtn.textContent = 'Включити';
        }, 5 * 1000); // 5 секунд
    }
}

//кнопка включення
toggleBtn.addEventListener('click', () => {
    bulb.classList.toggle('off');
    toggleBtn.textContent = bulb.classList.contains('off') ? 'Включити' : 'Виключити';
    resetBulbTimer();
    bulb.style.opacity = 1;
});

//зміна лампочки
typeSelect.addEventListener('change', (e) => {
    bulb.classList.remove('regular', 'energy', 'led');
    bulb.classList.add(e.target.value);
    resetBulbTimer();
    bulb.style.opacity = 1;
});

//зміна яскравості
brightnessBtn.addEventListener('click', () => {
    if (typeSelect.value === 'energy') return alert('Не підтримується');
    let b = prompt('Яскравість (10-100):', '100');
    if (b && !isNaN(b)) {
        bulb.style.opacity = Math.max(0.1, Math.min(1, b / 100));
        resetBulbTimer();
    }
});


// Завдання 2: Світлофор
const lights = {
    red: document.getElementById('redLight'),
    yellow: document.getElementById('yellowLight'),
    green: document.getElementById('greenLight')
};
const tfStateText = document.getElementById('tfStateText');
let tfTimes = { red: 5000, yellow: 3000, green: 7000 };
let tfState = -1; // -1: off, 0: red, 1: yellow, 2: green, 3: flash
let tfTimer, flashInterval;

function setAllDim() {
    lights.red.classList.add('dim');
    lights.yellow.classList.add('dim');
    lights.green.classList.add('dim');
}

function nextTrafficState() {
    clearTimeout(tfTimer);
    clearInterval(flashInterval);
    setAllDim();

    if (tfState === -1) tfState = 0;
    else tfState = (tfState + 1) % 4;

    if (tfState === 0) {
        lights.red.classList.remove('dim');
        tfStateText.textContent = 'Червоний';
        tfTimer = setTimeout(nextTrafficState, tfTimes.red);
    } else if (tfState === 1) {
        lights.yellow.classList.remove('dim');
        tfStateText.textContent = 'Жовтий';
        tfTimer = setTimeout(nextTrafficState, tfTimes.yellow);
    } else if (tfState === 2) {
        lights.green.classList.remove('dim');
        tfStateText.textContent = 'Зелений';
        tfTimer = setTimeout(nextTrafficState, tfTimes.green);
    } else if (tfState === 3) {
        tfStateText.textContent = 'Миготливий жовтий';
        let flashes = 0;
        flashInterval = setInterval(() => {
            lights.yellow.classList.toggle('dim');
            flashes++;
            if (flashes >= 6) {
                clearInterval(flashInterval);
                nextTrafficState();
            }
        }, 500);
    }
}

//старт/стоп
document.getElementById('tfStartBtn').addEventListener('click', () => {
    if (tfState === -1) { nextTrafficState(); }
    else {
        clearTimeout(tfTimer); clearInterval(flashInterval);
        setAllDim(); tfState = -1; tfStateText.textContent = 'Вимкнено';
    }
});

//наступний стан
document.getElementById('tfNextBtn').addEventListener('click', () => {
    if (tfState !== -1) nextTrafficState();
});

//змінити час станів
document.getElementById('tfSetTimeBtn').addEventListener('click', () => {
    let r = prompt('Червоний (сек):', tfTimes.red/1000);
    let y = prompt('Жовтий (сек):', tfTimes.yellow/1000);
    let g = prompt('Зелений (сек):', tfTimes.green/1000);
    if(r) tfTimes.red = r * 1000;
    if(y) tfTimes.yellow = y * 1000;
    if(g) tfTimes.green = g * 1000;
});


// Завдання 3: Дата та час
// Годинник
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').innerHTML =
        `${String(now.getHours()).padStart(2, '0')}:` +
        `${String(now.getMinutes()).padStart(2, '0')}<span class="${now.getSeconds() % 2 === 0 ? 'blink' : ''}">:</span>` +
        `${String(now.getSeconds()).padStart(2, '0')}`;
}, 1000);

// Таймер
let countdownTimer;
document.getElementById('startTimerBtn').addEventListener('click', () => {
    const targetDate = new Date(document.getElementById('timerInput').value).getTime();
    if (isNaN(targetDate)) return alert('Оберіть дату!');

    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const dist = targetDate - now;
        if (dist < 0) {
            clearInterval(countdownTimer);
            document.getElementById('timerDisplay').textContent = "Час вийшов!";
            return;
        }
        let d = Math.floor(dist / (1000 * 60 * 60 * 24));
        let h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((dist % (1000 * 60)) / 1000);
        document.getElementById('timerDisplay').textContent = `${d}д ${h}г ${m}хв ${s}с`;
    }, 1000);
});

// День народження
document.getElementById('calendarInput').value = new Date().toISOString().slice(0, 7);

document.getElementById('calcBdayBtn').addEventListener('click', () => {
    const bdayInput = document.getElementById('bdayInput').value;
    if (!bdayInput) return;

    let now = new Date();
    let bday = new Date(bdayInput);
    bday.setFullYear(now.getFullYear());
    if (bday < now) bday.setFullYear(now.getFullYear() + 1);

    const diff = bday - now;
    let d = Math.floor(diff / (1000 * 60 * 60 * 24));
    let h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('bdayDisplay').textContent = `До ДН: ${d} днів, ${h} годин, ${m} хвилин, ${s} секунд`;
});


// Завдання 4: Map, Set, WeakMap, WeakSet
const catalog = new Map(); // id -> product obj
const productNames = new Set(); // unique names
const historyInfo = new WeakMap(); // product obj -> history string
const orderedItems = new WeakSet(); // product objs that have been ordered

const out = document.getElementById('storeOutput');
function logInfo(msg) { out.value += msg + '\n'; out.scrollTop = out.scrollHeight; }

function getInputs() {
    return {
        id: document.getElementById('pId').value,
        name: document.getElementById('pName').value,
        price: parseFloat(document.getElementById('pPrice').value),
        qty: parseInt(document.getElementById('pQty').value)
    };
}

//додати
document.getElementById('addProdBtn').addEventListener('click', () => {
    const {id, name, price, qty} = getInputs();
    if (!id || !name || isNaN(price) || isNaN(qty)) return logInfo('Помилка вводу');
    if (catalog.has(id)) return logInfo('Товар з таким ID вже існує');

    const product = { id, name, price, qty };
    catalog.set(id, product);
    productNames.add(name);
    historyInfo.set(product, `Створено: ${new Date().toLocaleTimeString()}`);
    logInfo(`Додано: ${name}`);
});

//видалити
document.getElementById('delProdBtn').addEventListener('click', () => {
    const id = document.getElementById('pId').value;
    if (catalog.has(id)) {
        const p = catalog.get(id);
        productNames.delete(p.name);
        catalog.delete(id);
        logInfo(`Видалено: ${p.name}`);
    } else {
        logInfo('Товар не знайдено');
    }
});

//оновити
document.getElementById('updProdBtn').addEventListener('click', () => {
    const {id, price, qty} = getInputs();
    if (catalog.has(id)) {
        const p = catalog.get(id);
        if (!isNaN(price)) p.price = price;
        if (!isNaN(qty)) p.qty = qty;
        historyInfo.set(p, historyInfo.get(p) + ` | Оновлено: ${new Date().toLocaleTimeString()}`);
        logInfo(`Оновлено: ${p.name} (Залишок: ${p.qty})`);
    }
});

//пошук
document.getElementById('searchProdBtn').addEventListener('click', () => {
    const name = document.getElementById('pName').value;
    if (productNames.has(name)) {
        for (let [id, p] of catalog) {
            if (p.name === name) {
                logInfo(`Знайдено: [ID:${id}] ${p.name}, Ціна: ${p.price}, К-сть: ${p.qty}. ${historyInfo.get(p)}`);
            }
        }
    } else {
        logInfo('Товар з такою назвою не знайдено');
    }
});

//замовити
document.getElementById('orderProdBtn').addEventListener('click', () => {
    const id = document.getElementById('pId').value;
    if (catalog.has(id)) {
        const p = catalog.get(id);
        if (p.qty > 0) {
            p.qty--;
            orderedItems.add(p);
            logInfo(`Замовлено: ${p.name}. Залишилось: ${p.qty}`);
        } else {
            logInfo(`Товар ${p.name} закінчився!`);
        }
    }
});