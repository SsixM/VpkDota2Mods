// Глобальная переменная для хранения позиции скролла
let savedScrollPosition = 0; 
let searchTimeout = null;

function handleSearch(e) {
    const q = e.target.value;
    clearTimeout(searchTimeout);
    
    // ОПТИМИЗАЦИЯ: Debounce 400ms, чтобы не вызывать лаги при быстром вводе
    searchTimeout = setTimeout(() => {
        if(q.trim().length > 0) {
            renderSearch(q);
        } else {
            // Если поле очистили - возвращаем категории
            if(isSearching) renderCategories(); 
        }
        if (typeof techSfx === 'function') techSfx();
    }, 400); 
}

async function fetchLastUpdate() {
    try {
        const res = await fetch(GITHUB_API);
        const data = await res.json();
        const date = new Date(data.commit.author.date);
        const label = document.getElementById('label-update');
        if (label) label.textContent = `${TR[lang].lastUpdate}: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
    } catch (e) { console.error('Update fetch fail'); }
}


function setFilter(f) {
    techSfx();
    activeFilter = f;
    renderCategories();
}

function setLang(l) {
    lang = l;
    saveState();
    
    const ruBtn = document.getElementById('lang-ru');
    const enBtn = document.getElementById('lang-en');
    if(ruBtn) ruBtn.style.color = l === 'ru' ? 'var(--accent)' : '#555';
    if(enBtn) enBtn.style.color = l === 'en' ? 'var(--accent)' : '#555';
    
    const searchInp = document.getElementById('search-input');
    if(searchInp) searchInp.placeholder = TR[lang].search;

    const lblSel = document.getElementById('label-selected');
    if(lblSel) lblSel.textContent = TR[lang].selected;
    
    const dlBtn = document.getElementById('dl-btn');
    if(dlBtn) dlBtn.textContent = TR[lang].build;

    // Обновляем текущий вид
    if (isSearching && searchInp) renderSearch(searchInp.value);
    else if (currentCat) renderMods(currentCat);
    else renderCategories();
}

// Флаг для предотвращения зацикливания
let isNavigating = false;

async function initApp() {
    document.body.className = `theme-${theme}`;
    if (typeof setLang === 'function') setLang(lang);
    if (typeof updateMainCounter === 'function') updateMainCounter();
    
    renderSkeletons();
    
    try {
        const res = await fetch(JSON_URL);
        CONFIG = await res.json();
        
        // КРИТИЧНО: При первой загрузке проверяем, есть ли аргумент в ссылке
        if (window.location.hash) {
            checkHash();
        } else {
            renderCategories();
        }
    } catch (e) { 
        console.error("Init fail", e);
    }
}

// Слушаем изменения хэша (когда пользователь жмет "Назад" или меняет ссылку)
window.addEventListener('hashchange', () => {
    if (!isNavigating) {
        checkHash();
    }
});

window.onload = initApp;

function checkHash() {
    const hash = decodeURIComponent(window.location.hash.substring(1));
    if (!hash) {
        renderCategories();
        return;
    }

    // Поиск категории
    const cat = CONFIG.find(c => c.id === hash);
    if (cat) {
        renderMods(hash);
        return;
    }
    
    // Поиск мода
    const modId = parseInt(hash);
    if (!isNaN(modId)) {
        const parentCat = CONFIG.find(c => c.mods.some(m => m.id === modId));
        if (parentCat) {
            renderMods(parentCat.id);
            setTimeout(() => openPreview(modId), 100);
            return;
        }
    }
    renderCategories();
}

document.getElementById('search-input').addEventListener('input', handleSearch);