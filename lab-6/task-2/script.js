'use strict';

const elements = {
    form: document.getElementById('todo-form'),
    input: document.getElementById('task-input'),
    list: document.getElementById('task-list'),
    sortBtns: document.querySelectorAll('.sort-btn')
};

// Стан (State)
let tasks = [];
let currentSort = 'createdAt'; // За замовчуванням сортуємо за датою додавання

// --- Утиліти ---
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
const getCurrentDate = () => new Date().toISOString();

// --- Чисті функції для роботи зі станом (Pure Functions) ---
// Не змінюють оригінальний масив, повертають нову копію
const addTaskLogic = (state, text) => [
    ...state,
    { id: generateId(), text, completed: false, createdAt: getCurrentDate(), updatedAt: getCurrentDate() }
];

const deleteTaskLogic = (state, id) => state.filter(t => t.id !== id);

const toggleTaskLogic = (state, id) => state.map(t =>
    t.id === id ? { ...t, completed: !t.completed, updatedAt: getCurrentDate() } : t
);

const editTaskLogic = (state, id, newText) => state.map(t =>
    t.id === id ? { ...t, text: newText, updatedAt: getCurrentDate() } : t
);

const sortTasksLogic = (state, sortBy) => {
    return [...state].sort((a, b) => {
        if (sortBy === 'completed') {
            // Спочатку невиконані (false), потім виконані (true)
            return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
        }
        // Для дат (createdAt, updatedAt) - від найновіших до старих
        return new Date(b[sortBy]) - new Date(a[sortBy]);
    });
};

// --- UI Функції ---
const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    // 1. Індикатор виконання
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'status-indicator';
    statusIndicator.title = 'Відзначити як виконане/невиконане';
    statusIndicator.addEventListener('click', () => {
        tasks = toggleTaskLogic(tasks, task.id);
        renderTasks();
    });

    // 2. Текст завдання (з можливістю редагування)
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    // Дозволяємо редагувати текст прямо в списку (тільки якщо не виконано)
    if (!task.completed) {
        textSpan.contentEditable = true;
    }

    // Зберігаємо зміни при втраті фокусу
    textSpan.addEventListener('blur', (e) => {
        const newText = e.target.textContent.trim();
        if (newText && newText !== task.text) {
            tasks = editTaskLogic(tasks, task.id, newText);
            renderTasks();
        } else {
            e.target.textContent = task.text; // Якщо стерли весь текст, повертаємо старий
        }
    });

    // Зберігаємо зміни при натисканні Enter
    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Забороняємо перенесення рядка
            textSpan.blur(); // Викликаємо blur для збереження
        }
    });

    // 3. Кнопка видалення
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Видалити';
    deleteBtn.addEventListener('click', () => {
        li.classList.add('fade-out'); // Анімація зникнення
        setTimeout(() => {
            tasks = deleteTaskLogic(tasks, task.id);
            renderTasks();
        }, 300); // Час збігається з CSS анімацією
    });

    li.append(statusIndicator, textSpan, deleteBtn);
    return li;
};

const renderTasks = () => {
    const sortedTasks = sortTasksLogic(tasks, currentSort);
    elements.list.innerHTML = '';
    sortedTasks.forEach(task => elements.list.appendChild(createTaskElement(task)));
};

// --- Обробники подій (Event Listeners) ---
elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = elements.input.value.trim();
    if (text) {
        tasks = addTaskLogic(tasks, text);
        elements.input.value = '';
        renderTasks();
    }
});

elements.sortBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentSort = e.target.dataset.sort;

        // Оновлюємо активну кнопку
        elements.sortBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        renderTasks();
    });
});

// --- Ініціалізація додатку з Mock даними ---
const initApp = () => {
    tasks = [
        { id: generateId(), text: 'Зробити лабу №6 з JS', completed: true, createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
        { id: generateId(), text: 'Оновити драйвери на Asus TUF', completed: true, createdAt: new Date(Date.now() - 100000).toISOString(), updatedAt: getCurrentDate() },
        { id: generateId(), text: 'Прогулятися по Чернівцях', completed: false, createdAt: new Date(Date.now() - 200000).toISOString(), updatedAt: getCurrentDate() }
    ];
    renderTasks();
};

initApp();