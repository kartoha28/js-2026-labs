const cardsData = [
    { id: 'js', title: 'JavaScript', subtitle: 'веб / скрипти', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
    { id: 'py', title: 'Python', subtitle: 'дані / AI', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    { id: 'java', title: 'Java', subtitle: 'бекенд / ентерпрайз', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
    { id: 'ts', title: 'TypeScript', subtitle: 'типізований JS', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
    { id: 'rust', title: 'Rust', subtitle: 'системи / швидкість', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg' },
    { id: 'go', title: 'Go', subtitle: 'хмара / мікросервіси', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg' },
    { id: 'kotlin', title: 'Kotlin', subtitle: 'Android / JVM', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg' },
    { id: 'swift', title: 'Swift', subtitle: 'iOS / macOS', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg' },
    { id: 'cpp', title: 'C++', subtitle: 'ігри / системи', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
    { id: 'php', title: 'PHP', subtitle: 'веб / сервер', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg' }
];

const grid = document.getElementById('card-grid');
const editBtn = document.getElementById('edit-btn');
const toolbarText = document.getElementById('toolbar-text');

let isEditing = false;
let draggedCard = null;
let placeholder = document.createElement('div');
placeholder.className = 'placeholder';

function renderCards() {
    cardsData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = data.id;
        card.innerHTML = `
            <button class="delete-btn">&times;</button>
            <img src="${data.img}" alt="${data.title}">
            <div class="card-title">${data.title}</div>
            <div class="card-subtitle">${data.subtitle}</div>
        `;
        grid.appendChild(card);
    });
}

editBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    const cards = document.querySelectorAll('.card');

    if (isEditing) {
        grid.classList.add('edit-mode');
        editBtn.textContent = 'Готово';
        editBtn.classList.add('btn-done');
        toolbarText.textContent = 'Перетягуйте картки або натискайте ✕ щоб видалити';

        cards.forEach(card => card.setAttribute('draggable', 'true'));
    } else {
        grid.classList.remove('edit-mode');
        editBtn.textContent = 'Редагувати';
        editBtn.classList.remove('btn-done');
        toolbarText.textContent = 'Натисніть «Редагувати» для керування картками';

        cards.forEach(card => card.removeAttribute('draggable'));
    }
});

grid.addEventListener('click', (e) => {
    if (isEditing && e.target.classList.contains('delete-btn')) {
        const card = e.target.closest('.card');
        card.remove();
    }
});

grid.addEventListener('dragstart', (e) => {
    if (!isEditing) {
        e.preventDefault();
        return;
    }

    draggedCard = e.target.closest('.card');

    placeholder.style.width = `${draggedCard.offsetWidth}px`;
    placeholder.style.height = `${draggedCard.offsetHeight}px`;

    setTimeout(() => {
        draggedCard.style.display = 'none';
        grid.insertBefore(placeholder, draggedCard);
    }, 0);
});

grid.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!isEditing || !draggedCard) return;

    const targetCard = e.target.closest('.card:not(.placeholder)');

    if (targetCard && targetCard !== draggedCard) {
        const rect = targetCard.getBoundingClientRect();
        const isAfter = e.clientX > rect.left + rect.width / 2;

        if (isAfter) {
            grid.insertBefore(placeholder, targetCard.nextSibling);
        } else {
            grid.insertBefore(placeholder, targetCard);
        }
    }
});

grid.addEventListener('dragend', (e) => {
    if (!isEditing || !draggedCard) return;

    draggedCard.style.display = 'flex';
    grid.insertBefore(draggedCard, placeholder);

    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }

    draggedCard = null;
});

renderCards();