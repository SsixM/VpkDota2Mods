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
        z-index: 1;
        overflow: hidden;
    `;

    const shards = ['❄', '•', '◦'];
    const count = 70; 

    for (let i = 0; i < count; i++) {
        const leaf = document.createElement('div');
        const size = Math.random() * 8 + 4 + 'px';
        const opacity = Math.random() * 0.4 + 0.1;
        const duration = Math.random() * 7 + 5 + 's';
        const delay = Math.random() * -20 + 's';
        const startX = Math.random() * 100;
        
        leaf.innerText = shards[Math.floor(Math.random() * shards.length)];
        leaf.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${startX}%;
            font-size: ${size};
            opacity: ${opacity};
            color: white;
            user-select: none;
            filter: blur(0.5px);
            animation: fall-fixed ${duration} ${delay} linear infinite;
        `;
        
        container.appendChild(leaf);
    }

    if (!document.getElementById('snow-style')) {
        const style = document.createElement('style');
        style.id = 'snow-style';
        style.innerHTML = `
            @keyframes fall-fixed {
                0% { 
                    transform: translateY(-5vh) translateX(0px) rotate(0deg); 
                }
                25% { 
                    transform: translateY(25vh) translateX(20px) rotate(90deg); 
                }
                50% { 
                    transform: translateY(50vh) translateX(-20px) rotate(180deg); 
                }
                75% { 
                    transform: translateY(75vh) translateX(20px) rotate(270deg); 
                }
                100% { 
                    transform: translateY(105vh) translateX(0px) rotate(360deg); 
                }
            }
        `;
        document.head.appendChild(style);
    }
}