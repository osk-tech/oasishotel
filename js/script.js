// ==================== Variables ====================
let menuData = null;
let currentCategory = 'breakfast';
let currentLang = localStorage.getItem('oasis_lang') || 'en';

const LAST_CATEGORY_KEY = 'oasis_last_category';
const CACHE_KEY = 'oasis_menu_cache';
const CACHE_VERSION_KEY = 'oasis_cache_version';
const CACHE_VERSION = 'v8'; // Cambiar esto invalida todos los caches
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// ==================== LocalStorage ====================
function saveMenuCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_KEY + '_time', Date.now().toString());
        localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
    } catch (e) { console.error('Error saving menu cache:', e); }
}

function getMenuCache() {
    try {
        const version = localStorage.getItem(CACHE_VERSION_KEY);
        const cached = localStorage.getItem(CACHE_KEY);
        const time = localStorage.getItem(CACHE_KEY + '_time');

        if (version !== CACHE_VERSION) {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_KEY + '_time');
            localStorage.removeItem(CACHE_VERSION_KEY);
            return null;
        }

        if (cached && time && (Date.now() - parseInt(time)) < CACHE_DURATION) {
            return JSON.parse(cached);
        }
    } catch (e) { }
    return null;
}

function saveLastCategory(cat) {
    try { localStorage.setItem(LAST_CATEGORY_KEY, cat); } catch (e) { console.error('Error saving last category:', e); }
}

function getLastCategory() {
    try { return localStorage.getItem(LAST_CATEGORY_KEY); } catch (e) { console.error('Error reading last category:', e); return null; }
}

// ==================== Idioma ====================
const UI_TRANSLATIONS = {
    en: {
        langBtn: 'ES',
        searchPlaceholder: 'Search dish...',
        loading: 'Loading menu...',
        noResults: (q) => `No results found for "${q}"`,
        clearSearch: 'Clear search',
        results: (q) => `Results: "${q}"`,
        offlineBanner: '📴 Offline - Showing cached data',
        categories: {
            breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner',
            snacks: 'Snacks', seafood: 'Seafood',
            'cold-drinks': 'Cold Drinks', 'hot-drinks': 'Hot Drinks', alcohol: 'Alcohol'
        }
    },
    es: {
        langBtn: 'EN',
        searchPlaceholder: 'Buscar platillo...',
        loading: 'Cargando menú...',
        noResults: (q) => `No se encontraron resultados para "${q}"`,
        clearSearch: 'Limpiar búsqueda',
        results: (q) => `Resultados: "${q}"`,
        offlineBanner: '📴 Sin conexión - Mostrando datos guardados',
        categories: {
            breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena',
            snacks: 'Snacks', seafood: 'Mariscos',
            'cold-drinks': 'Bebidas Frías', 'hot-drinks': 'Bebidas Calientes', alcohol: 'Alcohol'
        }
    }
};

function getLangText(item, field) {
    if (currentLang === 'es') return item[field + '_es'] || item[field] || '';
    return item[field] || '';
}

function getCategoryTitle(cat) {
    if (currentLang === 'es') return cat.titulo_es || cat.titulo || '';
    return cat.titulo || '';
}

function updateStaticUI() {
    const t = UI_TRANSLATIONS[currentLang];

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        const label = langBtn.querySelector('.lang-label');
        if (label) label.textContent = t.langBtn;
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;

    document.querySelectorAll('.category-btn').forEach(btn => {
        const cat = btn.dataset.category;
        if (cat && t.categories[cat]) {
            btn.textContent = t.categories[cat];
            btn.title = t.categories[cat];
        }
    });
}

// ==================== Utilidades ====================
function escapeHTML(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function formatPrice(price) {
    if (!price) return '';
    const num = parseFloat(price.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return price;
    return 'Q' + num.toFixed(2);
}

// ==================== Carga de Datos ====================
async function loadMenuData() {
    const container = document.getElementById('menu-items-container');
    container.innerHTML = `<div class="loading-state"><div class="loader"></div><p>${UI_TRANSLATIONS[currentLang].loading}</p></div>`;

    try {
        const response = await fetch('data/menu.json?t=' + Date.now());
        if (!response.ok) throw new Error('Error al cargar menu.json');

        const freshData = await response.json();

        if (!freshData.menu || typeof freshData.menu !== 'object') {
            throw new Error('Estructura JSON inválida');
        }

        menuData = freshData;
        saveMenuCache(menuData);

        const lastCat = getLastCategory();
        if (lastCat) {
            if (menuData.menu[lastCat]) {
                currentCategory = lastCat;
            }
        }

        renderMenu();
    } catch (error) {
        const cached = getMenuCache();
        if (cached) {
            menuData = cached;
            showOfflineBanner();
            renderMenu();
        } else {
            container.innerHTML = '<div class="empty-state"><p>Error loading menu. Try refreshing the page.</p></div>';
        }
    }
}

function showOfflineBanner() {
    const banner = document.createElement('div');
    banner.className = 'offline-banner';
    banner.textContent = UI_TRANSLATIONS[currentLang].offlineBanner;
    document.body.insertBefore(banner, document.body.firstChild);
    setTimeout(() => banner.remove(), 5000);
}

// ==================== Renderizado ====================
function renderMenu() {
    if (!menuData) return;

    const container = document.getElementById('menu-items-container');

    // Maintain height to prevent sticky nav overlap and layout shift
    const currentHeight = container.offsetHeight;
    if (currentHeight > 0) {
        container.style.minHeight = currentHeight + 'px';
    }

    container.innerHTML = '';

    // Reiniciar animación fadeIn
    container.style.animation = 'none';
    void container.offsetWidth;
    container.style.animation = '';

    const cat = menuData.menu[currentCategory];
    if (!cat || !cat.items) return;

    const titleEl = document.getElementById('category-title');
    if (titleEl) titleEl.textContent = getCategoryTitle(cat) || currentCategory;

    cat.items.forEach((item, i) => {
        container.appendChild(createItemElement(item, i));
    });

    updateButtons();

    // Reset minHeight after a short delay to allow items to render
    setTimeout(() => {
        container.style.minHeight = '';
    }, 100);
}

function createItemElement(item, index) {
    if (item.type === 'section-header') {
        const div = document.createElement('div');
        div.className = 'menu-section-header';
        div.textContent = (currentLang === 'es' ? (item.titulo_es || item.titulo) : item.titulo) || '';
        return div;
    }

    const div = document.createElement('div');
    div.className = 'menu-item animate-in';
    div.style.animationDelay = (index * 0.06) + 's';

    const nombre = getLangText(item, 'nombre');
    const descripcion = getLangText(item, 'descripcion');

    const imageHTML = item.imagen
        ? `<img src="${escapeHTML(item.imagen)}" alt="${escapeHTML(nombre)}" class="menu-item-image" loading="lazy" onerror="this.style.display='none'">`
        : '';

    div.innerHTML = `
        ${imageHTML}
        <div class="menu-item-content">
            <div class="menu-item-header">
                <h3 class="menu-item-name">${escapeHTML(nombre)}</h3>
                <span class="menu-item-price">${formatPrice(item.precio)}</span>
            </div>
            <p class="menu-item-description">${escapeHTML(descripcion)}</p>
        </div>
    `;

    // Event listener para toda la card
    div.addEventListener('click', () => showItemModal(item));

    return div;
}

// ==================== Modal ====================
function showItemModal(item) {
    const modal = document.getElementById('item-modal');
    const modalImage = document.getElementById('modal-image');

    if (!modal) return;

    if (item.imagen) {
        modalImage.src = item.imagen;
        modalImage.alt = getLangText(item, 'nombre');
        modalImage.style.display = 'block';

        const img = new Image();
        img.onerror = () => {
            modalImage.style.display = 'none';
        };
        img.src = item.imagen;
    } else {
        modalImage.style.display = 'none';
    }

    const nameEl = document.getElementById('modal-name');
    const descEl = document.getElementById('modal-description');
    const priceEl = document.getElementById('modal-price');
    const catEl = document.getElementById('modal-category');

    if (!nameEl || !descEl || !priceEl || !catEl) return;

    nameEl.textContent = getLangText(item, 'nombre');
    descEl.textContent = getLangText(item, 'descripcion') || '';
    priceEl.textContent = formatPrice(item.precio);
    catEl.textContent = item._cat || '';

    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeModal() {
    const modalEl = document.getElementById('item-modal');
    if (modalEl) modalEl.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// ==================== Botones ====================
function updateButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        const isActive = btn.dataset.category === currentCategory;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });
}

function switchCategory(cat) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
        clearBtn.classList.remove('visible');
    }

    currentCategory = cat;
    saveLastCategory(cat);
    renderMenu();
}

// ==================== Búsqueda ====================
function initSearch() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');
    let timer;

    input.addEventListener('input', () => {
        clearBtn.classList.toggle('visible', input.value.length > 0);
        clearTimeout(timer);
        timer = setTimeout(() => doSearch(input.value), 300);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('visible');
        renderMenu();
    });
}

function doSearch(query) {
    if (!query.trim()) {
        renderMenu();
        return;
    }

    const results = [];
    const q = query.toLowerCase();

    // Búsqueda en todas las categorías
    Object.entries(menuData.menu).forEach(([catKey, cat]) => {
        if (cat.items && Array.isArray(cat.items)) {
            const catTitle = getCategoryTitle(cat);
            cat.items.forEach(item => {
                if (item.type === 'section-header') return;
                const nombre = getLangText(item, 'nombre').toLowerCase();
                const desc = getLangText(item, 'descripcion').toLowerCase();
                if (nombre.includes(q) || desc.includes(q)) {
                    results.push({ ...item, _cat: catTitle });
                }
            });
        }
    });

    const container = document.getElementById('menu-items-container');
    container.innerHTML = '';
    const t = UI_TRANSLATIONS[currentLang];
    document.getElementById('category-title').textContent = t.results(query);

    if (results.length === 0) {
        // Crear elemento con botón
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `<p>${escapeHTML(t.noResults(query))}</p>`;

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn-clear-search';
        clearBtn.textContent = t.clearSearch;
        clearBtn.addEventListener('click', () => {
            document.getElementById('search-input').value = '';
            const clearBtnEl = document.getElementById('search-clear');
            if (clearBtnEl) clearBtnEl.classList.remove('visible');
            renderMenu();
        });

        emptyDiv.appendChild(clearBtn);
        container.appendChild(emptyDiv);
        return;
    }

    results.forEach((item, i) => {
        const div = createItemElement(item, i);
        const tag = document.createElement('div');
        tag.className = 'menu-category-tag';
        tag.textContent = item._cat;
        div.querySelector('.menu-item-content').prepend(tag);
        container.appendChild(div);
    });
}

// ==================== Inicialización ====================
document.addEventListener('DOMContentLoaded', () => {
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');

    if (searchToggle && searchContainer) {
        searchToggle.addEventListener('click', () => {
            searchToggle.classList.toggle('active');
            searchContainer.classList.toggle('expanded');
            if (searchContainer.classList.contains('expanded')) {
                searchInput.focus();
            }
        });

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.classList.remove('visible');
                searchInput.dispatchEvent(new Event('input'));
            });
        }

        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                setTimeout(() => {
                    searchToggle.classList.remove('active');
                    searchContainer.classList.remove('expanded');
                }, 200);
            }
        });
    }

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            localStorage.setItem('oasis_lang', currentLang);

            // Limpiar búsqueda activa
            const searchInput = document.getElementById('search-input');
            const searchClearBtn = document.getElementById('search-clear');
            if (searchInput) searchInput.value = '';
            if (searchClearBtn) searchClearBtn.classList.remove('visible');

            updateStaticUI();
            renderMenu();
        });
    }

    updateStaticUI();
    loadMenuData();

    const categoryBtns = document.querySelectorAll('.category-btn');
    if (categoryBtns) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category;
                if (cat) switchCategory(cat);
            });
        });
    }

    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    const modal = document.getElementById('item-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'item-modal') closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    initSearch();
    initSWUpdate();
});

function initSWUpdate() {
    const updateBtn = document.getElementById('update-btn');
    const updateBanner = document.getElementById('update-banner');

    if (!('serviceWorker' in navigator) || !updateBtn || !updateBanner) {
        return;
    }

    navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
            const newSW = registration.installing;
            if (!newSW) return;

            newSW.addEventListener('statechange', () => {
                if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                    updateBanner.hidden = false;
                }
            });
        });

        if (registration.waiting && navigator.serviceWorker.controller) {
            updateBanner.hidden = false;
        }
    });

    updateBtn.addEventListener('click', () => {
        navigator.serviceWorker.ready.then((registration) => {
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        });
        window.location.reload();
    });
}