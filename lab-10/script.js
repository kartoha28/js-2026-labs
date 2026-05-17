/**
 * Lab 10: Social Network Friends Search SPA
 * Functional programming style, pure functions, no frameworks.
 */

// --- 1. STATE MANAGEMENT ---
const API_URL = 'https://randomuser.me/api/';
const USERS_PER_PAGE = 30;

let appState = {
    users: [],
    savedUsersMap: JSON.parse(localStorage.getItem('savedUsersMap')) || {},
    page: 1,
    filters: {
        name: '',
        age: '',
        location: '',
        email: '',
        sex: 'all',
        showSavedOnly: false
    },
    sort: {
        field: null,
        dir: 'asc'
    },
    isLoading: false,
    error: null
};

// --- 2. PURE FUNCTIONS FOR DATA MANIPULATION ---

const filterUsers = (users, filters, savedUsersMap) => {
    return users.filter(user => {
        if (filters.showSavedOnly && !savedUsersMap[user.login.uuid]) return false;
        if (filters.sex !== 'all' && user.gender !== filters.sex) return false;
        if (filters.age && user.dob.age !== parseInt(filters.age)) return false;
        if (filters.location && !user.location.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
        if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
        if (filters.name) {
            const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
            if (!fullName.includes(filters.name.toLowerCase())) return false;
        }
        return true;
    });
};

const sortUsers = (users, sort) => {
    if (!sort.field) return users;
    
    return [...users].sort((a, b) => {
        let valA, valB;
        if (sort.field === 'age') {
            valA = a.dob.age;
            valB = b.dob.age;
        } else if (sort.field === 'name') {
            valA = a.name.first.toLowerCase();
            valB = b.name.first.toLowerCase();
        } else if (sort.field === 'registered') {
            valA = new Date(a.registered.date).getTime();
            valB = new Date(b.registered.date).getTime();
        }
        
        if (valA < valB) return sort.dir === 'asc' ? -1 : 1;
        if (valA > valB) return sort.dir === 'asc' ? 1 : -1;
        return 0;
    });
};

const getProcessedUsers = (state) => {
    const filtered = filterUsers(state.users, state.filters, state.savedUsersMap);
    return sortUsers(filtered, state.sort);
};

// --- 3. DECORATORS & UTILS ---

const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

// --- 4. URL API & HISTORY API ---

const updateURLFromState = (state) => {
    const url = new URL(window.location);
    url.searchParams.set('page', state.page);
    if (state.filters.name) url.searchParams.set('name', state.filters.name);
    else url.searchParams.delete('name');
    
    if (state.filters.age) url.searchParams.set('age', state.filters.age);
    else url.searchParams.delete('age');
    
    if (state.filters.location) url.searchParams.set('location', state.filters.location);
    else url.searchParams.delete('location');

    if (state.filters.email) url.searchParams.set('email', state.filters.email);
    else url.searchParams.delete('email');
    
    if (state.filters.sex !== 'all') url.searchParams.set('sex', state.filters.sex);
    else url.searchParams.delete('sex');
    
    if (state.sort.field) {
        url.searchParams.set('sort', state.sort.field);
        url.searchParams.set('dir', state.sort.dir);
    } else {
        url.searchParams.delete('sort');
        url.searchParams.delete('dir');
    }

    if (state.filters.showSavedOnly) url.searchParams.set('saved', 'true');
    else url.searchParams.delete('saved');

    window.history.pushState(state, '', url);
};

const loadStateFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    appState.page = parseInt(params.get('page')) || 1;
    appState.filters.name = params.get('name') || '';
    appState.filters.age = params.get('age') || '';
    appState.filters.location = params.get('location') || '';
    appState.filters.email = params.get('email') || '';
    appState.filters.sex = params.get('sex') || 'all';
    appState.sort.field = params.get('sort') || null;
    appState.sort.dir = params.get('dir') || 'asc';
    appState.filters.showSavedOnly = params.get('saved') === 'true';
    
    updateUIControls();
};

// --- 5. DOM MANIPULATION & UI ---

const createCardHTML = (user, isSaved) => {
    const fullName = `${user.name.first} ${user.name.last}`;
    const genderClass = user.gender === 'female' ? 'female' : 'male';
    const starIcon = isSaved ? '★' : '☆';
    const starClass = isSaved ? 'saved' : '';

    return `
        <div class="user-card">
            <button class="btn-save ${starClass}" data-uuid="${user.login.uuid}">${starIcon}</button>
            <div class="card-header ${genderClass}">
                ${fullName}
            </div>
            <img class="card-avatar" src="${user.picture.large}" alt="${fullName}">
            <div class="card-body">
                <p class="age">I am ${user.dob.age} years old.</p>
                <p>${user.email}</p>
                <p>${user.phone}</p>
                <p><strong>${user.location.city}</strong></p>
            </div>
            <div class="card-footer ${genderClass}">
                ${user.gender.toUpperCase()}
            </div>
        </div>
    `;
};

const renderUsers = () => {
    const grid = document.getElementById('users-grid');
    const processedUsers = getProcessedUsers(appState);
    
    grid.innerHTML = processedUsers.map(user => 
        createCardHTML(user, !!appState.savedUsersMap[user.login.uuid])
    ).join('');
    
    renderPagination();
};

const renderPagination = () => {
    const container = document.getElementById('pagination-pages');
    // Just show the current page active and up to page
    let html = '';
    for (let i = 1; i <= appState.page; i++) {
        html += `<div class="page-item active">${i}</div>`;
    }
    container.innerHTML = html;
};

const updateUIControls = () => {
    document.getElementById('search-name').value = appState.filters.name;
    document.getElementById('filter-age').value = appState.filters.age;
    document.getElementById('filter-location').value = appState.filters.location;
    document.getElementById('filter-email').value = appState.filters.email;
    
    const sexRadios = document.getElementsByName('filter-sex');
    sexRadios.forEach(radio => {
        radio.checked = radio.value === appState.filters.sex;
    });
    
    const savedBtn = document.getElementById('btn-toggle-saved');
    if (appState.filters.showSavedOnly) {
        savedBtn.style.background = '#ff4081'; // Active state
        savedBtn.textContent = 'SHOW ALL FRIENDS';
    } else {
        savedBtn.style.background = '#3f51b5';
        savedBtn.textContent = 'SHOW SAVED ONLY';
    }
};

const toggleLoading = (isLoading) => {
    document.getElementById('loading-indicator').style.display = isLoading ? 'block' : 'none';
};

const showError = (msg) => {
    const el = document.getElementById('error-message');
    if (msg) {
        el.textContent = msg;
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
};

// --- 6. API REQUESTS ---

const fetchUsers = async (pageToFetch) => {
    appState.isLoading = true;
    toggleLoading(true);
    showError(null);
    
    try {
        const seed = 'lab10seed'; // Keep the same users across pages for consistency during testing
        const response = await fetch(`${API_URL}?page=${pageToFetch}&results=${USERS_PER_PAGE}&seed=${seed}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Append users ensuring no duplicates (just in case)
        const newUsers = data.results.filter(nu => !appState.users.some(u => u.login.uuid === nu.login.uuid));
        appState.users = [...appState.users, ...newUsers];
        
        renderUsers();
    } catch (error) {
        showError('Failed to fetch users: ' + error.message);
    } finally {
        appState.isLoading = false;
        toggleLoading(false);
    }
};

// --- 7. EVENT LISTENERS & INITIALIZATION ---

const setupEventListeners = () => {
    // Auth Forms (Tabs logic)
    document.getElementById('btn-login').addEventListener('click', () => {
        document.getElementById('btn-login').classList.add('active');
        document.getElementById('btn-signup').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('signup-form').classList.remove('active');
    });

    document.getElementById('btn-signup').addEventListener('click', () => {
        document.getElementById('btn-signup').classList.add('active');
        document.getElementById('btn-login').classList.remove('active');
        document.getElementById('signup-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
    });

    // Auth Actions
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('username').value;
        if (email) {
            localStorage.setItem('currentUser', email);
            checkAuth();
        } else {
            document.getElementById('login-error').textContent = 'Please enter an email';
        }
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        checkAuth();
    });
    
    // Sort Buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            appState.sort.field = e.target.dataset.sort;
            appState.sort.dir = e.target.dataset.dir;
            updateURLFromState(appState);
            renderUsers();
        });
    });

    // Search Input (Debounced)
    const handleSearch = debounce((e) => {
        appState.filters.name = e.target.value;
        updateURLFromState(appState);
        renderUsers();
    }, 300);
    document.getElementById('search-name').addEventListener('input', handleSearch);

    // Apply Filters Button
    document.getElementById('btn-apply-filters').addEventListener('click', () => {
        appState.filters.age = document.getElementById('filter-age').value;
        appState.filters.location = document.getElementById('filter-location').value;
        appState.filters.email = document.getElementById('filter-email').value;
        appState.filters.sex = document.querySelector('input[name="filter-sex"]:checked').value;
        
        // reset to page 1 when filtering
        appState.page = 1; 
        updateURLFromState(appState);
        renderUsers();
    });

    // Reset Filters
    document.getElementById('btn-reset-filters').addEventListener('click', () => {
        appState.filters = { name: '', age: '', location: '', email: '', sex: 'all', showSavedOnly: false };
        appState.sort = { field: null, dir: 'asc' };
        appState.page = 1;
        updateURLFromState(appState);
        updateUIControls();
        renderUsers();
    });

    // Saved Friends Toggle
    document.getElementById('btn-toggle-saved').addEventListener('click', () => {
        appState.filters.showSavedOnly = !appState.filters.showSavedOnly;
        updateURLFromState(appState);
        updateUIControls();
        renderUsers();
    });

    // Save User Button (Event Delegation)
    document.getElementById('users-grid').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-save')) {
            const uuid = e.target.dataset.uuid;
            if (appState.savedUsersMap[uuid]) {
                delete appState.savedUsersMap[uuid];
            } else {
                const userToSave = appState.users.find(u => u.login.uuid === uuid);
                if (userToSave) appState.savedUsersMap[uuid] = userToSave;
            }
            localStorage.setItem('savedUsersMap', JSON.stringify(appState.savedUsersMap));
            renderUsers(); // re-render to update star icon
        }
    });

    // Infinite Scroll
    window.addEventListener('scroll', debounce(() => {
        if (appState.isLoading) return;
        const trigger = document.getElementById('infinite-scroll-trigger');
        const triggerPos = trigger.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (triggerPos < windowHeight + 200) { // 200px threshold
            appState.page += 1;
            updateURLFromState(appState);
            fetchUsers(appState.page);
        }
    }, 200));

    // History API popstate
    window.addEventListener('popstate', (e) => {
        if (e.state) {
            appState = { ...appState, ...e.state };
            updateUIControls();
            renderUsers();
        } else {
            loadStateFromURL();
            renderUsers();
        }
    });
};

// --- 8. INIT ---

const checkAuth = async () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('auth-view').style.display = 'none';
        document.getElementById('app-view').style.display = 'flex';
        document.getElementById('current-user-email').textContent = `Logged in as: ${currentUser}`;
        
        loadStateFromURL();
        
        // Fetch users up to current page
        appState.users = []; // reset
        for (let i = 1; i <= appState.page; i++) {
            await fetchUsers(i);
        }
    } else {
        document.getElementById('auth-view').style.display = 'block';
        document.getElementById('app-view').style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkAuth();
});
