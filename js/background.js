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