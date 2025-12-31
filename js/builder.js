async function build() {
    if(!selected.size) return;
    if (typeof clickSfx === 'function') clickSfx();
    
    const btn = document.getElementById('dl-btn');
    const pFill = document.getElementById('p-fill');
    const pWrap = document.getElementById('p-wrap');
    const originalText = btn.textContent;
    
    let pLabel = document.getElementById('progress-label');
    if(!pLabel) {
        pLabel = document.createElement('div');
        pLabel.id = 'progress-label';
        pLabel.className = 'text-[14px] font-black uppercase tracking-tighter text-white/40 mt-2 text-center';
        pWrap.after(pLabel);
    }

    btn.disabled = true; 
    btn.textContent = TR[lang].building;
    pWrap.style.opacity = '1';
    
    try {
        const zip = new JSZip();
        const selectedMods = CONFIG.flatMap(c => c.mods).filter(m => selected.has(m.id));
        const filesToDownload = [];
        
        // Формируем список задач для скачивания
        selectedMods.forEach(m => {
            if (m.file) filesToDownload.push({ url: m.file, label: m['name_'+lang], id: m.id, type: 'dir' });
            if (m.file2) filesToDownload.push({ url: m.file2, label: m['name_'+lang], id: m.id, type: '000' });
        });

        const bats = ['loader_ru.bat', 'loader_en.bat', 'delete_mods.bat'];
        for(let b of bats) {
            try {
                const r = await fetch(VPK_BASE_URL + b);
                if(r.ok) zip.file('mods/'+ b, await r.arrayBuffer());
            } catch(e) { console.warn(`Failed to fetch ${b}`); }
        }

        // 1. Считаем общий объем данных
        pLabel.textContent = 'Чык чырык...';
        let totalBytes = 0;
        const sizeRequests = await Promise.all(
            filesToDownload.map(f => fetch(VPK_BASE_URL + f.url, { method: 'HEAD' }).catch(() => null))
        );
        
        sizeRequests.forEach(res => {
            if (res && res.ok) {
                totalBytes += parseInt(res.headers.get('content-length') || 0);
            }
        });

        let loadedBytes = 0;

        // 2. Потоковое скачивание
        for(const fileObj of filesToDownload) {
            const response = await fetch(VPK_BASE_URL + fileObj.url);
            if (!response.ok) continue;

            const reader = response.body.getReader();
            const chunks = [];
            let fileLoaded = 0;
            
            while(true) {
                const {done, value} = await reader.read();
                if (done) break;
                
                chunks.push(value);
                loadedBytes += value.length;
                fileLoaded += value.length;
                
                if (totalBytes > 0) {
                    const percent = (loadedBytes / totalBytes) * 100;
                    pFill.style.width = `${percent}%`;
                    pLabel.textContent = `${Math.round(percent)}% [${fileObj.label}]`;
                }
            }

            // Собираем файл из чанков
            const blob = new Blob(chunks);
            const arrayBuffer = await blob.arrayBuffer();
            
            // Генерируем имя файла безопасно, используя данные из объекта, а не RegExp из URL
            const fileName = `pak${fileObj.id}_${fileObj.type === '000' ? '000' : 'dir'}.vpk`;
            zip.file(`mods/data/${fileName}`, arrayBuffer);
        }

        pLabel.textContent = 'Finalizing...';
        if (typeof buildSfx === 'function') buildSfx();
        
        const blob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `VPK_CORE_PACK.zip`;
        a.click();
        
        setTimeout(() => {
            if (typeof openInstructionModal === 'function') openInstructionModal();
        }, 500);

    } catch (err) { 
        console.error("Build error:", err);
        if (typeof showToast === 'function') showToast("Error during build", true); 
    } finally { 
        btn.disabled = false; 
        btn.textContent = originalText;
        pLabel.textContent = '';
        setTimeout(() => { 
            pWrap.style.opacity = '0'; 
            setTimeout(() => { pFill.style.width = '0%'; }, 500);
        }, 2000); 
    }
}