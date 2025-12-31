function openPreview(id) {
    const mod = CONFIG.flatMap(c => c.mods).find(m => m.id === id);
    if(!mod) return;
    
    techSfx();
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'preview-modal';
    overlay.onclick = (e) => { if(e.target === overlay) closePreview(); };

    overlay.innerHTML = `
        <div class="modal-content !max-w-4xl !p-0 overflow-hidden border border-white/10 bg-[#08090d]">
            <div class="relative group">
                <img src="${ASSETS_BASE_URL}${mod.img}" class="w-full h-auto max-h-[80vh] object-contain bg-black/40">
                
                <button onclick="closePreview()" class="absolute top-6 right-6 w-12 h-12 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all z-50 group/btn">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </button>

                <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h2 class="font-heading text-4xl font-black text-white tracking-tighter">${mod['name_'+lang]}</h2>
                    <p class="text-neutral-400 mt-2 font-medium max-w-2xl">${mod['desc_'+lang] || ''}</p>
                </div>
            </div>
        </div>`;
    document.body.appendChild(overlay);
}

function closePreview() {
    const m = document.getElementById('preview-modal');
    if(m) {
        hoverSfx();
        m.remove();
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
                    Понял, за работу
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