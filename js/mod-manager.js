function toggleMod(id, catId) {
    clickSfx();
    const cat = CONFIG.find(c => c.id === catId);
    if(cat && cat.exclusive) {
        cat.mods.forEach(m => {
            if(m.id !== id && selected.has(m.id)) {
                selected.delete(m.id);
                document.getElementById(`mod-${m.id}`)?.classList.remove('mod-selected');
            }
        });
    }
    const card = document.getElementById(`mod-${id}`);
    if(selected.has(id)) {
        selected.delete(id);
        card?.classList.remove('mod-selected');
    } else {
        selected.add(id);
        card?.classList.add('mod-selected');
    }
    saveState();
    updateMainCounter();
}