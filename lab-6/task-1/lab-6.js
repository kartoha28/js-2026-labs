'use strict';

// 3.2 Збір DOM-елементів
const elements = {
    productList: document.getElementById('product-list'),
    emptyMessage: document.getElementById('empty-message'),
    totalPrice: document.getElementById('total-price'),
    filterButtonsContainer: document.getElementById('filter-buttons'),
    resetFilterBtn: document.getElementById('reset-filter-btn'),
    sortButtons: document.querySelectorAll('.sort-btn'),
    resetSortBtn: document.getElementById('reset-sort-btn'),
    addNewBtn: document.getElementById('add-new-product-btn'),
    modal: document.getElementById('product-modal'),
    form: document.getElementById('product-form'),
    modalTitle: document.getElementById('modal-title'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    snackbar: document.getElementById('snackbar'),
    // Поля форми
    idInput: document.getElementById('product-id'),
    nameInput: document.getElementById('product-name'),
    priceInput: document.getElementById('product-price'),
    categoryInput: document.getElementById('product-category'),
    imageInput: document.getElementById('product-image'),
};

// Стан додатку (State)
let products = [];
let currentFilter = null;
let currentSort = null;

// 3.3 Утиліти
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
const getCurrentDate = () => new Date().toISOString();
const formatPrice = (price) => Number(price).toFixed(2) + ' ₴';

// Core Functions (Чисті функції - не змінюють вхідний масив, повертають новий)
const addProductLogic = (state, data) => [...state, { ...data, id: generateId(), createdAt: getCurrentDate(), updatedAt: getCurrentDate() }];
const updateProductLogic = (state, id, data) => state.map(p => p.id === id ? { ...p, ...data, updatedAt: getCurrentDate() } : p);
const deleteProductLogic = (state, id) => state.filter(p => p.id !== id);
const calcTotalLogic = (state) => state.reduce((sum, p) => sum + Number(p.price), 0);
const getCategoriesLogic = (state) => [...new Set(state.map(p => p.category))];
const filterProductsLogic = (state, category) => category ? state.filter(p => p.category === category) : state;
const sortProductsLogic = (state, sortBy) => {
    if (!sortBy) return state;
    return [...state].sort((a, b) => {
        if (sortBy === 'price') return Number(a.price) - Number(b.price);
        return new Date(b[sortBy]) - new Date(a[sortBy]); // Від нових до старих
    });
};

// UI Функції
const showSnackbar = (message) => {
    elements.snackbar.textContent = message;
    elements.snackbar.classList.remove('show');
    void elements.snackbar.offsetWidth; // Примусовий reflow для перезапуску анімації
    elements.snackbar.classList.add('show');
};

const toggleModal = (show = true, editMode = false, product = null) => {
    if (show) {
        elements.modal.classList.remove('hidden');
        elements.modalTitle.textContent = editMode ? 'Редагувати товар' : 'Додати товар';
        if (product) {
            elements.idInput.value = product.id;
            elements.nameInput.value = product.name;
            elements.priceInput.value = product.price;
            elements.categoryInput.value = product.category;
            elements.imageInput.value = product.image;
        } else {
            elements.form.reset();
            elements.idInput.value = '';
        }
    } else {
        elements.modal.classList.add('hidden');
    }
};

const renderFilterButtons = () => {
    const categories = getCategoriesLogic(products);
    elements.filterButtonsContainer.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        if (currentFilter === cat) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentFilter = cat;
            renderProducts();
        });
        elements.filterButtonsContainer.appendChild(btn);
    });
};

const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-id">ID: ${product.id}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${formatPrice(product.price)}</div>
            <div class="product-category">${product.category}</div>
            <div class="product-actions">
                <button class="edit-btn">Редагувати</button>
                <button class="delete-btn">Видалити</button>
            </div>
        </div>
    `;

    card.querySelector('.edit-btn').addEventListener('click', () => toggleModal(true, true, product));

    card.querySelector('.delete-btn').addEventListener('click', () => {
        card.classList.add('fade-out'); // Запуск CSS анімації
        setTimeout(() => {
            products = deleteProductLogic(products, product.id);
            renderProducts();
            showSnackbar(`Товар успішно видалено зі списку!`);
        }, 400); // Таймінг збігається з часом анімації fadeOut в CSS
    });

    return card;
};

const renderProducts = () => {
    const processedProducts = sortProductsLogic(filterProductsLogic(products, currentFilter), currentSort);

    elements.emptyMessage.style.display = processedProducts.length === 0 ? 'block' : 'none';

    Array.from(elements.productList.children).forEach(child => {
        if (child !== elements.emptyMessage) child.remove();
    });

    processedProducts.forEach(p => elements.productList.appendChild(createProductCard(p)));
    elements.totalPrice.textContent = formatPrice(calcTotalLogic(processedProducts));
    renderFilterButtons();
};

// Event Listeners (Обробники подій)
elements.addNewBtn.addEventListener('click', () => toggleModal(true, false));
elements.closeModalBtn.addEventListener('click', () => toggleModal(false));

elements.form.addEventListener('submit', (e) => {
    e.preventDefault(); // HTML5 валідація проходить автоматично перед цією подією

    const productData = {
        name: elements.nameInput.value,
        price: Number(elements.priceInput.value),
        category: elements.categoryInput.value,
        image: elements.imageInput.value
    };

    const editId = elements.idInput.value;

    if (editId) {
        products = updateProductLogic(products, editId, productData);
        showSnackbar(`Оновлено товар: ${editId} (${productData.name})`);
    } else {
        products = addProductLogic(products, productData);
        showSnackbar(`Товар успішно додано!`);
    }

    toggleModal(false);
    renderProducts();
});

elements.resetFilterBtn.addEventListener('click', () => {
    currentFilter = null;
    renderProducts();
});

elements.sortButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentSort = e.target.dataset.sort;
        elements.sortButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProducts();
    });
});

elements.resetSortBtn.addEventListener('click', () => {
    currentSort = null;
    elements.sortButtons.forEach(b => b.classList.remove('active'));
    renderProducts();
});

// 2. Mock Data та ініціалізація
const initApp = () => {
    products = [
        { id: generateId(), name: 'Ноутбук Asus', price: 35000, category: 'Електроніка', image: 'src/asusNotebook.jpg', createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
        { id: generateId(), name: 'Рюкзак', price: 1200, category: 'Інше', image: 'src/bagpack.jpg', createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
        { id: generateId(), name: 'Гаррі Поттер', price: 450, category: 'Книги', image: 'src/bookHarryPotter.jpg', createdAt: getCurrentDate(), updatedAt: getCurrentDate() }
    ];
    renderProducts();
};

initApp();