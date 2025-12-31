function renderSkeletons() {
    const content = document.getElementById('app-content');
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            ${Array(6).fill(`
                <div class="glass-card p-8 h-[380px] animate-pulse relative">
                    <div class="aspect-[4/3] bg-white/5 rounded-2xl mb-6"></div>
                    <div class="h-6 bg-white/10 w-3/4 rounded-lg mb-4"></div>
                    <div class="h-4 bg-white/5 w-1/2 rounded-lg"></div>
                </div>
            `).join('')}
        </div>`;
}

function createCardHtml(m, catId, idx) {
    const isSel = selected.has(m.id);
    return `
        <div class="glass-card mod-card p-5 cursor-pointer relative stagger-item ${isSel ? 'mod-selected' : ''}" 
             style="animation-delay: ${idx * 0.05}s" id="mod-${m.id}" onmouseenter="hoverSfx()">
            <div onclick="toggleMod(${m.id}, '${catId}')" class="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative bg-zinc-900 group">
                <img src="${ASSETS_BASE_URL}${m.img}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <div class="check-overlay"><svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>
                
                <button onclick="event.stopPropagation(); openPreview(${m.id})" class="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--accent)] hover:text-white z-20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="3" stroke-linecap="round"/></svg>
                </button>
            </div>
            <div onclick="toggleMod(${m.id}, '${catId}')">
                <h4 class="font-heading text-lg font-bold leading-tight mb-2 text-white line-clamp-1">${m['name_'+lang]}</h4>
                <p class="text-[12px] text-neutral-500 leading-relaxed line-clamp-2 mb-3">${m['desc_'+lang] || ''}</p>
                <div class="flex justify-between items-center">
                    ${m.exclusive ? '<span class="text-[8px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase font-bold">Exclusive</span>' : ''}
                </div>
            </div>
        </div>`;
}

function renderFilterBar() {
    return `
        <div class="flex gap-4 mb-12 stagger-item">
            ${Object.entries(FILTERS).map(([key, val]) => `
                <button onclick="setFilter('${key}')" class="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === key ? 'bg-[var(--accent)] text-white shadow-lg' : 'bg-white/5 text-neutral-500 hover:bg-white/10'}">
                    ${val[lang]}
                </button>
            `).join('')}
        </div>`;
}

function renderCategories() {
    isSearching = false; currentCat = null;
    const content = document.getElementById('app-content');
    
    let modsToDisplay = CONFIG.flatMap(c => c.mods.map(m => ({...m, catId: c.id})));
    if(activeFilter === 'new') modsToDisplay = modsToDisplay.sort((a,b) => b.id - a.id).slice(0, 12);
    if(activeFilter === 'selected') modsToDisplay = modsToDisplay.filter(m => selected.has(m.id));

    content.innerHTML = `
        ${renderFilterBar()}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            ${activeFilter === 'all' ? 
                CONFIG.map((cat, i) => `
                <div onclick="renderMods('${cat.id}')" onmouseenter="hoverSfx()" class="glass-card cat-card p-10 cursor-pointer group stagger-item" style="animation-delay: ${i*0.06}s">
                    <div class="folder-preview mb-8">
                        <img src="${ASSETS_BASE_URL}${cat.mods[0].img}" class="folder-img img-1">
                        <img src="${ASSETS_BASE_URL}${cat.mods[1]?.img || cat.mods[0].img}" class="folder-img img-2">
                    </div>
                    <div class="text-center relative z-10">
                        <h3 class="font-heading text-4xl font-black mb-3 group-hover:text-[var(--accent)] tracking-tight">${cat[lang]}</h3>
                        <div class="inline-block px-4 py-1.5 bg-white/5 rounded-full text-[10px] text-neutral-500 font-black uppercase tracking-widest">${cat.mods.length} ${TR[lang].items}</div>
                    </div>
                </div>`).join('') :
                modsToDisplay.map((m, i) => createCardHtml(m, m.catId, i)).join('')
            }
        </div>`;
}

function renderMods(catId) {
    currentCat = catId; isSearching = false;
    const cat = CONFIG.find(c => c.id === catId);
    document.getElementById('app-content').innerHTML = `
        <div class="stagger-item">
            <div onclick="renderCategories()" class="inline-flex items-center gap-3 mb-12 cursor-pointer text-neutral-500 hover:text-white uppercase font-black text-[11px] tracking-[0.3em]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="3" stroke-linecap="round"/></svg>${TR[lang].back}
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                ${cat.mods.map((m, i) => createCardHtml(m, catId, i)).join('')}
            </div>
        </div>`;
}

function renderSearch(q) {
    isSearching = true; currentCat = null;
    if(!q.trim()) { renderCategories(); return; }
    let html = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 stagger-item">`;
    let found = false;
    CONFIG.forEach(cat => {
        const matches = cat.mods.filter(m => m.name_ru.toLowerCase().includes(q.toLowerCase()) || m.name_en.toLowerCase().includes(q.toLowerCase()));
        if(matches.length) {
            found = true;
            html += `<div class="col-span-full mt-8 mb-4 flex items-center gap-4"><span class="text-2xl font-black font-heading text-white/20">${cat[lang]}</span><div class="h-px bg-white/5 flex-grow"></div></div>`;
            html += matches.map(m => createCardHtml(m, cat.id, 0)).join('');
        }
    });
    if(!found) html += `<div class="col-span-full text-center py-40 opacity-30 font-heading text-2xl uppercase tracking-[0.5em]">${TR[lang].empty}</div>`;
    document.getElementById('app-content').innerHTML = html + `</div>`;
}