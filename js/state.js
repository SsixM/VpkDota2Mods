let CONFIG = [];
let lang = localStorage.getItem('vpk_lang') || 'ru';
let theme = localStorage.getItem('vpk_theme') || 'core';
let selected = new Set(JSON.parse(localStorage.getItem('vpk_selected') || '[]'));
let currentCat = null;
let isSearching = false;
let activeFilter = 'all'; 
let previewMod = null; 

function saveState() {
    localStorage.setItem('vpk_selected', JSON.stringify([...selected]));
    localStorage.setItem('vpk_lang', lang);
    localStorage.setItem('vpk_theme', theme);
}