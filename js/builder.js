let buildController = null;

async function build() {
    const btn = document.getElementById('dl-btn');
    
    if (buildController) {
        buildController.abort();
        if (typeof hoverSfx === 'function') hoverSfx();
        return;
    }

    if(!selected.size) return;
    if (typeof clickSfx === 'function') clickSfx();
    
    const pFill = document.getElementById('p-fill');
    const pWrap = document.getElementById('p-wrap');
    const originalText = btn.textContent;
    
    buildController = new AbortController();
    const signal = buildController.signal;

    let pLabel = document.getElementById('progress-label');
    if(!pLabel) {
        pLabel = document.createElement('div');
        pLabel.id = 'progress-label';
        pLabel.className = 'text-[18px] font-black uppercase tracking-tighter text-white/40 mt-2 text-center';
        pWrap.after(pLabel);
    }

    btn.textContent = lang === 'ru' ? 'ОТМЕНИТЬ' : 'CANCEL';
    btn.classList.add('bg-red-500', 'text-white');
    pWrap.style.opacity = '1';
    
    try {
        const zip = new JSZip();
        
        // Мапим выбранные моды, находим их категорию для формирования пути (Пункт 7)
        const selectedMods = [];
        CONFIG.forEach(cat => {
            cat.mods.forEach(m => {
                if(selected.has(m.id)) {
                    // Сохраняем ID категории для каждого мода
                    selectedMods.push({ ...m, catId: cat.id });
                }
            });
        });

        // Формируем список файлов
        const filesToDownload = [];
        selectedMods.forEach(m => {
            if (m.file) filesToDownload.push({ url: m.file, label: m['name_'+lang], id: m.id, catId: m.catId, type: 'dir' });
            if (m.file2) filesToDownload.push({ url: m.file2, label: m['name_'+lang], id: m.id, catId: m.catId, type: '000' });
        });

        const getFullUrl = (u) => u.startsWith('http') ? u : VPK_BASE_URL + u;

        // Базовые скрипты
        const bats = ['loader_ru.bat', 'loader_en.bat', 'delete_mods.bat'];
        for(let b of bats) {
            const r = await fetch(VPK_BASE_URL + b, { signal });
            if(r.ok) zip.file('mods/'+ b, await r.arrayBuffer());
        }

        let loadedBytes = 0;
        const totalFiles = filesToDownload.length;
        
        for(let i = 0; i < totalFiles; i++) {
            const fileObj = filesToDownload[i];
            const url = getFullUrl(fileObj.url);
            
            pLabel.textContent = `${Math.round((i / totalFiles) * 100)}% [${fileObj.label}]`;
            
            const response = await fetch(url, { signal });
            if (!response.ok) continue;

            const blob = await response.blob();
            
            // Логика распаковки
            if (fileObj.url.endsWith('.zip')) {
                const zipContent = await JSZip.loadAsync(blob);
                
                for (const [filename, fileData] of Object.entries(zipContent.files)) {
                    if (fileData.dir) continue;
                    
                    const content = await fileData.async('arraybuffer');
                    
                    if (filename.endsWith('.vpk')) {
                        // VPK всегда кладем в mods/data
                        const typeSuffix = filename.includes('_000') ? '000' : 'dir';
                        const newName = `pak${fileObj.id}_${typeSuffix}.vpk`;
                        zip.file(`mods/data/${newName}`, content);
                    } else {
                        // ИСПРАВЛЕНИЕ: Инструменты летят в mods/tools/[ID_КАТЕГОРИИ]/[ИмяФайла]
                        const cleanName = filename.split('/').pop(); 
                        if(cleanName) {
                            // fileObj.catId - это ID категории (например 'visual', 'cursor' и т.д.)
                            zip.file(`mods/tools/${fileObj.catId}/${cleanName}`, content);
                        }
                    }
                }
            } else {
                // Обычные VPK
                const fileName = `pak${fileObj.id}_${fileObj.type === '000' ? '000' : 'dir'}.vpk`;
                zip.file(`mods/data/${fileName}`, await blob.arrayBuffer());
            }
            
            const percent = ((i + 1) / totalFiles) * 100;
            pFill.style.width = `${percent}%`;
        }

        pLabel.textContent = 'Архивация...';
        if (typeof buildSfx === 'function') buildSfx();
        
        const blob = await zip.generateAsync({type: "blob"});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `VPK_CORE_PACK.zip`;
        a.click();
        
        setTimeout(() => {
            if (typeof openInstructionModal === 'function') openInstructionModal();
        }, 500);

    } catch (err) { 
        if (err.name === 'AbortError') {
            pLabel.textContent = lang === 'ru' ? 'СБОРКА ПРЕРВАНА' : 'BUILD ABORTED';
        } else {
            console.error(err);
            if (typeof showToast === 'function') showToast("Error building pack", true); 
        }
    } finally { 
        buildController = null;
        btn.textContent = originalText;
        btn.classList.remove('bg-red-500', 'text-white');
        
        setTimeout(() => { 
            pWrap.style.opacity = '0'; 
            pFill.style.width = '0%';
            pLabel.textContent = '';
        }, 2000); 
    }
}