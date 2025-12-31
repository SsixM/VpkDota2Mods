document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    const mesh = document.getElementById('mesh');
    if (mesh) { 
        mesh.style.setProperty('--mx', `${x}%`); 
        mesh.style.setProperty('--my', `${y}%`); 
    }
});

function setTheme(t) {
    theme = t;
    saveState();
    document.body.className = `theme-${t}`;
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d.title.toLowerCase() === t));
    initSnow();
}
function initBackground() {
    const mesh = document.getElementById('mesh');
    if (!mesh) return;

    let ticking = false;

    document.addEventListener('mousemove', e => {
        if (!ticking) {
            // Оптимизация: обновляем координаты только в следующем кадре отрисовки
            window.requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                mesh.style.setProperty('--mx', `${x}%`);
                mesh.style.setProperty('--my', `${y}%`);
                ticking = false;
            });
            ticking = true;
        }
    });
}