function showToast(text, isError) {
    const t = document.getElementById('toast');
    t.textContent = text; 
    t.style.background = isError ? '#ef4444' : '#fff'; 
    t.style.color = isError ? '#fff' : '#000';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function updateMainCounter() {
    const countEl = document.getElementById('count');
    const btn = document.getElementById('dl-btn');
    if (countEl) countEl.textContent = selected.size;
    if (btn) btn.disabled = (selected.size === 0);
}