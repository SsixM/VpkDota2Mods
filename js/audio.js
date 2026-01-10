const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const masterGain = audioCtx.createGain();
masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
masterGain.connect(audioCtx.destination);

function playSfx(freq, type = 'sine', duration = 0.1, vol = 0.05, sweep = false) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);

    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    
    if (sweep) {
        osc.frequency.exponentialRampToValueAtTime(freq * 0.1, audioCtx.currentTime + duration);
    }
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const clickSfx = () => playSfx(600, 'triangle', 0.08, 0.03, true);
const hoverSfx = () => playSfx(1200, 'sine', 0.04, 0.015);
const buildSfx = () => {
    playSfx(150, 'square', 0.4, 0.05, true);
    setTimeout(() => playSfx(800, 'sine', 0.1, 0.02), 50);
};
const techSfx = () => playSfx(1800, 'sawtooth', 0.02, 0.01);
const modalSfx = () => playSfx(300, 'sine', 0.2, 0.04, false);
