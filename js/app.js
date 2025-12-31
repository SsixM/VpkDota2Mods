function handleSearch(e) {
    const q = e.target.value;
    clearTimeout(searchTimeout);
    
    // Ждем 300мс после последнего нажатия клавиши
    searchTimeout = setTimeout(() => {
        renderSearch(q);
        if (typeof techSfx === 'function') techSfx();
    }, 300);
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
    
    // UI Update
    document.getElementById('lang-ru').style.color = l === 'ru' ? 'var(--accent)' : '#555';
    document.getElementById('lang-en').style.color = l === 'en' ? 'var(--accent)' : '#555';
    document.getElementById('search-input').placeholder = TR[lang].search;
    document.getElementById('label-selected').textContent = TR[lang].selected;
    document.getElementById('dl-btn').textContent = TR[lang].build;
    document.getElementById('modal-title').textContent = TR[lang].subtitle;
    document.getElementById('btn-modal-close').textContent = TR[lang].close;
    document.getElementById('items').textContent = TR[lang].mods;

    fetchLastUpdate();
    if (isSearching) renderSearch(document.getElementById('search-input').value);
    else if (currentCat) renderMods(currentCat);
    else renderCategories();
}

window.onload = async () => {
    document.body.className = `theme-${theme}`;
    if (typeof setLang === 'function') setLang(lang);
    if (typeof updateMainCounter === 'function') updateMainCounter();
    
    // Показываем скелетоны мгновенно
    renderSkeletons();
    
    try {
        // Оптимизация: используем кэширование браузера для JSON
        const res = await fetch(JSON_URL, { cache: "force-cache" });
        CONFIG = await res.json();
        
        // requestAnimationFrame гарантирует плавный запуск отрисовки
        requestAnimationFrame(() => {
            renderCategories();
        });
    } catch (e) { 
        console.error("Initialization failed", e);
    }
    
    if (typeof initSnow === 'function') initSnow();
    
    // Активация AudioContext только при первом взаимодействии
    document.addEventListener('mousedown', () => {
        if (window.audioCtx && window.audioCtx.state === 'suspended') {
            window.audioCtx.resume();
        }
    }, { once: true });
};

document.getElementById('search-input').addEventListener('input', (e) => renderSearch(e.target.value));