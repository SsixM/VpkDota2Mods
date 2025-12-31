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
    btn.classList.add('bg-red-500', 'text-white'); // Визуально выделяем, что теперь это отмена
    pWrap.style.opacity = '1';
    
    try {
        const zip = new JSZip();
        const selectedMods = CONFIG.flatMap(c => c.mods).filter(m => selected.has(m.id));
        const filesToDownload = [];
        
        selectedMods.forEach(m => {
            if (m.file) filesToDownload.push({ url: m.file, label: m['name_'+lang], id: m.id, type: 'dir' });
            if (m.file2) filesToDownload.push({ url: m.file2, label: m['name_'+lang], id: m.id, type: '000' });
        });

        const bats = ['loader_ru.bat', 'loader_en.bat', 'delete_mods.bat'];
        for(let b of bats) {
            const r = await fetch(VPK_BASE_URL + b, { signal });
            if(r.ok) zip.file('mods/'+ b, await r.arrayBuffer());
        }

        pLabel.textContent = '';
        let totalBytes = 0;
        const sizeRequests = await Promise.all(
            filesToDownload.map(f => fetch(VPK_BASE_URL + f.url, { method: 'HEAD', signal }).catch(() => null))
        );
        
        sizeRequests.forEach(res => {
            if (res && res.ok) totalBytes += parseInt(res.headers.get('content-length') || 0);
        });

        let loadedBytes = 0;

        for(const fileObj of filesToDownload) {
            const response = await fetch(VPK_BASE_URL + fileObj.url, { signal });
            if (!response.ok) continue;

            const reader = response.body.getReader();
            const chunks = [];
            
            while(true) {
                const {done, value} = await reader.read();
                if (done) break;
                
                chunks.push(value);
                loadedBytes += value.length;
                
                if (totalBytes > 0) {
                    const percent = (loadedBytes / totalBytes) * 100;
                    pFill.style.width = `${percent}%`;
                    pLabel.textContent = `${Math.round(percent)}% [${fileObj.label}]`;
                }
            }

            const blob = new Blob(chunks);
            const fileName = `pak${fileObj.id}_${fileObj.type === '000' ? '000' : 'dir'}.vpk`;
            zip.file(`mods/data/${fileName}`, await blob.arrayBuffer());
        }

        pLabel.textContent = 'Чык чырык';
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
            if (typeof showToast === 'function') showToast("Error", true); 
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