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
    const sourceBtn = m.source ? `
        <a href="${m.source}" target="_blank" onclick="event.stopPropagation(); if(typeof hoverSfx === 'function') hoverSfx()" 
           class="p-2.5 bg-black/60 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:scale-110 z-20"
           title="${TR[lang].source}">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>` : '';

    return `
        <div class="glass-card mod-card p-4 cursor-pointer relative stagger-item ${isSel ? 'mod-selected' : ''}" 
             style="animation-delay: ${idx * 0.05}s" id="mod-${m.id}" onmouseenter="if(typeof hoverSfx === 'function') hoverSfx()">
            <div onclick="toggleMod(${m.id}, '${catId}')" class="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative bg-zinc-900 group">
                <img src="${ASSETS_BASE_URL}${m.img}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100">
                <div class="check-overlay"><svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>
                
                <div class="absolute top-3 right-3 flex gap-2">
                    ${sourceBtn}
                    <button onclick="event.stopPropagation(); openPreview(${m.id})" class="p-2.5 bg-black/60 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--accent)] hover:scale-110 z-20">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </button>
                </div>
            </div>
            <div onclick="toggleMod(${m.id}, '${catId}')" class="flex flex-col h-[80px]">
                <h4 class="font-heading text-base font-bold leading-tight mb-1.5 text-white/90 group-hover:text-white transition-colors line-clamp-1">${m['name_'+lang]}</h4>
                <p class="text-[12px] text-neutral-400 leading-snug line-clamp-2 font-medium">${m['desc_'+lang] || ''}</p>
                <div class="mt-auto flex justify-end">
                    ${m.exclusive ? '<span class="text-[8px] bg-white/5 text-[var(--accent)] border border-[var(--accent)]/30 px-2 py-0.5 rounded-md uppercase font-black tracking-widest">Exclusive</span>' : ''}
                </div>
            </div>
        </div>`;
}

function renderCategories() {
    isSearching = false; currentCat = null;
    const content = document.getElementById('app-content');
    let modsToDisplay = CONFIG.flatMap(c => c.mods.map(m => ({...m, catId: c.id})));
    if(activeFilter === 'new') modsToDisplay = modsToDisplay.sort((a,b) => b.id - a.id).slice(0, 12);
    if(activeFilter === 'selected') modsToDisplay = modsToDisplay.filter(m => selected.has(m.id));

    let html = renderFilterBar();
    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
    
    if (activeFilter === 'all') {
        html += CONFIG.map((cat, i) => `
            <div onclick="renderMods('${cat.id}')" onmouseenter="if(typeof hoverSfx === 'function') hoverSfx()" 
                 class="glass-card cat-card p-6 cursor-pointer group stagger-item flex flex-col min-h-[360px]" 
                 style="animation-delay: ${i*0.06}s">
                
                <div class="folder-preview mb-6 flex-shrink-0 pointer-events-none">
                    <img src="${ASSETS_BASE_URL}${cat.mods[0].img}" loading="lazy" class="folder-img img-1 shadow-2xl">
                    <img src="${ASSETS_BASE_URL}${cat.mods[1]?.img || cat.mods[0].img}" loading="lazy" class="folder-img img-2 shadow-2xl">
                </div>

                <div class="flex flex-col flex-grow">
                    <h3 class="font-heading text-2xl font-black text-white/90 group-hover:text-white tracking-tight transition-colors mb-2 text-center uppercase">
                        ${cat[lang]}
                    </h3>
                    
                    <div class="mt-auto flex justify-center">
                        <div class="px-4 py-1 bg-white/5 rounded-lg border border-white/5">
                             <span class="text-[11px] text-neutral-400 font-black uppercase tracking-widest">
                                ${cat.mods.length} ${TR[lang].items}
                            </span>
                        </div>
                    </div>
                </div>
            </div>`).join('');
    } else {
        html += modsToDisplay.map((m, i) => createCardHtml(m, m.catId, i)).join('');
    }
    
    html += '</div>';
    content.innerHTML = html;
}

function renderFilterBar() {
    return `
        <div class="flex flex-wrap gap-3 mb-10 stagger-item">
            ${Object.entries(FILTERS).map(([key, val]) => `
                <button onclick="setFilter('${key}')" class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === key ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20' : 'bg-white/5 text-neutral-400 border-white/5 hover:border-white/20'}">
                    ${val[lang]}
                </button>
            `).join('')}
        </div>`;
}

function renderMods(catId) {
    currentCat = catId;
    const cat = CONFIG.find(c => c.id === catId);
    document.getElementById('app-content').innerHTML = `
        <div class="stagger-item">
            <button onclick="renderCategories(); if(typeof hoverSfx === 'function') hoverSfx();" 
                 class="flex items-center gap-2 mb-8 text-neutral-500 hover:text-white transition-all uppercase font-black text-[10px] tracking-widest group">
                <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M15 19l-7-7 7-7"/></svg>
                ${TR[lang].back}
            </button>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                ${cat.mods.map((m, i) => createCardHtml(m, catId, i)).join('')}
            </div>
        </div>`;
}

function renderFilterBar() {
    return `<div class="flex flex-wrap gap-4 mb-12 stagger-item">${Object.entries(FILTERS).map(([key, val]) => `<button onclick="setFilter('${key}')" class="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === key ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20' : 'bg-white/5 text-neutral-500 hover:bg-white/10 border border-white/5'}">${val[lang]}</button>`).join('')}</div>`;
}

function renderMods(catId) {
    currentCat = catId; isSearching = false;
    const cat = CONFIG.find(c => c.id === catId);
    document.getElementById('app-content').innerHTML = `
        <div class="stagger-item">
            <div onclick="renderCategories(); if(typeof hoverSfx === 'function') hoverSfx();" 
                 class="inline-flex items-center gap-3 mb-12 cursor-pointer text-neutral-500 hover:text-white transition-colors uppercase font-black text-[11px] tracking-[0.3em] group">
                <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="3" stroke-linecap="round"/>
                </svg>
                ${TR[lang].back}
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            html += `<div class="col-span-full mt-8 mb-4 flex items-center gap-4"><span class="text-2xl font-black font-heading text-white/20 uppercase tracking-tighter">${cat[lang]}</span><div class="h-px bg-white/5 flex-grow"></div></div>`;
            html += matches.map(m => createCardHtml(m, cat.id, 0)).join('');
        }
    });
    if(!found) html += `<div class="col-span-full text-center py-40 opacity-30 font-heading text-2xl uppercase tracking-[0.5em]">${TR[lang].empty}</div>`;
    document.getElementById('app-content').innerHTML = html + `</div>`;
}