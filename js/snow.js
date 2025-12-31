function initSnow() {
    const container = document.getElementById('snow-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;

    const shards = ['❄', '•', '◦'];
    const count = window.innerWidth < 768 ? 30 : 60;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const leaf = document.createElement('div');
        const size = Math.random() * 7 + 3 + 'px';
        const duration = Math.random() * 5 + 7 + 's';
        const delay = Math.random() * -20 + 's';
        
        leaf.innerText = shards[Math.floor(Math.random() * shards.length)];
        leaf.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}%;
            font-size: ${size};
            opacity: ${Math.random() * 0.4 + 0.2};
            color: white;
            pointer-events: none;
            user-select: none;
            animation: fall-fixed ${duration} ${delay} linear infinite;
        `;
        fragment.appendChild(leaf);
    }
    container.appendChild(fragment);

    if (!document.getElementById('snow-style-fixed')) {
        const style = document.createElement('style');
        style.id = 'snow-style-fixed';
        style.innerHTML = `
            @keyframes fall-fixed {
                0% { transform: translateY(-5vh) translateX(0) rotate(0deg); }
                33% { transform: translateY(33vh) translateX(20px) rotate(120deg); }
                66% { transform: translateY(66vh) translateX(-20px) rotate(240deg); }
                100% { transform: translateY(105vh) translateX(0) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}