function openPreview(id) {
    const mod = CONFIG.flatMap(c => c.mods).find(m => m.id === id);
    if(!mod) return;
    
    // Исправление 9: Установка хэша
    window.location.hash = id;

    if (typeof techSfx === 'function') techSfx();
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active flex items-center justify-center p-4 md:p-8';
    overlay.id = 'preview-modal';
    overlay.onclick = (e) => { if(e.target === overlay) closePreview(); };

    const sourceLink = mod.source ? `
        <a href="${mod.source}" target="_blank" class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-blue-400 transition-colors mt-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${TR[lang].source}
        </a>` : '';

    overlay.innerHTML = `
        <div class="modal-content !max-w-5xl !p-0 overflow-hidden border border-white/10 bg-[#0c0d12] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative animate-in zoom-in duration-300">
            <button onclick="closePreview()" class="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500 transition-all z-50 text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            
            <div class="flex flex-col lg:flex-row">
                <div class="lg:w-2/3 bg-black flex items-center justify-center overflow-hidden">
                    <img src="${ASSETS_BASE_URL}${mod.img}" class="w-full h-full object-cover min-h-[400px]">
                </div>
                <div class="lg:w-1/3 p-8 flex flex-col border-l border-white/5 bg-[#0e1015]">
                    <div class="mb-6">
                        <span class="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-2 block">${TR[lang].previewMode}</span>
                        <h2 class="font-heading text-3xl font-black text-white tracking-tighter leading-tight">${mod['name_'+lang]}</h2>
                        ${sourceLink}
                    </div>
                    <div class="flex-grow">
                        <p class="text-neutral-400 text-sm leading-relaxed font-medium">${mod['desc_'+lang] || TR[lang].noDesc}</p>
                    </div>
                    <button onclick="toggleMod(${mod.id}); closePreview();" class="mt-8 w-full py-4 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${selected.has(mod.id) ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-white text-black hover:bg-[var(--accent)] hover:text-white'}">
                        ${selected.has(mod.id) ? TR[lang].removePack : TR[lang].selectMod}
                    </button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(overlay);
}

function closePreview() {
    const m = document.getElementById('preview-modal');
    if(m) {
        if (typeof hoverSfx === 'function') hoverSfx();
        m.classList.remove('active');
        setTimeout(() => m.remove(), 200);
        
        // Возвращаем хэш к категории
        if (currentCat) {
            window.location.hash = currentCat;
        } else {
            window.location.hash = "";
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    }
}

function openInstructionModal() {
    modalSfx();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'inst-modal';
    overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };

    const content = lang === 'ru' ? {
        title: 'Сборка готова!',
        desc: 'Архив успешно сформирован. Чтобы всё заработало, следуй инструкции:',
        steps: [
            { t: 'Распаковка', d: 'ОБЯЗАТЕЛЬНО извлеки папку "mods" из архива в любое удобное место.' },
            { t: 'Loader.bat', d: 'Запускает процесс установки/обновления модов в игру.' },
            { t: 'Delete_mods.bat', d: 'Полностью очищает игру от установленных модификаций.' },
            { t: 'Data/', d: 'Здесь лежат твои выбранные .vpk файлы (не трогай их вручную).' }
        ]
    } : {
        title: 'Pack Ready!',
        desc: 'Archive created. Follow these steps to install:',
        steps: [
            { t: 'Unzip', d: 'You MUST extract the "mods" folder before running scripts.' },
            { t: 'Loader.bat', d: 'Starts the installation/update process.' },
            { t: 'Delete_mods.bat', d: 'Cleans all mods from your game files.' },
            { t: 'Data/', d: 'Contains your selected .vpk files (do not move them).' }
        ]
    };

    overlay.innerHTML = `
        <div class="modal-content !max-w-2xl border border-white/5 bg-[#0a0b10] shadow-2xl">
            <div class="p-8 border-b border-white/5 bg-white/[0.02]">
                <h2 class="text-3xl font-black text-white tracking-tight">${content.title}</h2>
                <p class="text-neutral-500 text-sm mt-1">${content.desc}</p>
            </div>
            <div class="p-8 space-y-6">
                ${content.steps.map(s => `
                    <div class="flex gap-4 group">
                        <div class="w-1 h-12 bg-white/5 group-hover:bg-[var(--accent)] transition-colors rounded-full"></div>
                        <div>
                            <h3 class="font-black text-[var(--accent)] uppercase text-[10px] tracking-widest">${s.t}</h3>
                            <p class="text-neutral-400 text-sm leading-relaxed">${s.d}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="p-8 pt-0">
                <button onclick="document.getElementById('inst-modal').remove()" class="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[var(--accent)] hover:text-white transition-all">
                    Понял
                </button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
}

function toggleSummary() {
    const m = document.getElementById('modal-summary');
    if(m.classList.contains('active')) {
        m.classList.remove('active');
        if (currentCat) renderMods(currentCat); else renderCategories();
    } else {
        clickSfx();
        updateModalList();
        m.classList.add('active');
    }
}

function updateModalList() {
    const list = document.getElementById('modal-list');
    list.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8";
    let html = "";
    CONFIG.forEach(cat => {
        const modsInCat = cat.mods.filter(m => selected.has(m.id));
        if(modsInCat.length > 0) {
            html += `<div class="col-span-full mt-8 mb-2 flex items-center gap-4"><h2 class="text-xl font-black text-white/80">${cat[lang]}</h2><div class="h-px bg-white/10 flex-grow"></div></div>`;
            html += modsInCat.map((m, i) => createCardHtml(m, cat.id, i)).join('');
        }
    });
    list.innerHTML = html || `<div class="col-span-full text-center py-20 opacity-20 text-3xl font-black uppercase">${TR[lang].empty}</div>`;
}