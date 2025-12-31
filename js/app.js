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
    setLang(lang);
    updateMainCounter();
    renderSkeletons()
    try {
        const res = await fetch(JSON_URL);
        CONFIG = await res.json();
        setTimeout(() => renderCategories(), 800); // Небольшая задержка для эффекта
    } catch (e) { showToast('Config Error', true); }
    
    initSnow();
};

document.getElementById('search-input').addEventListener('input', (e) => renderSearch(e.target.value));