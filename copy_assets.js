const fs = require('fs');
const path = require('path');

const srcDrawable = String.raw`C:\Users\anciz\Music\APK\NequiGlitch\app\src\main\res\drawable`;
const srcFont = String.raw`C:\Users\anciz\Music\APK\NequiGlitch\app\src\main\res\font`;
const dstImg = String.raw`C:\Users\anciz\Documents\app\assets\img`;
const dstFont = String.raw`C:\Users\anciz\Documents\app\assets\fonts`;

// Create dirs
fs.mkdirSync(dstImg, { recursive: true });
fs.mkdirSync(dstFont, { recursive: true });

const images = [
    'fondo.png', 'clavefondopage.png', 'homenequifondo.png',
    'tu_plata.png', 'tres_botones.png', 'bre_b_icon.png',
    'mi_negocio_icon.png', 'tigo_icon.png', 'wom_icon.png',
    'tienda_virtual_icon.png', 'bolsillos_icon.png', 'claro_icon.png',
    'mas_servicios_icon.png', 'heart.png', 'edit.png',
    'fondobanner.png', 'opacidad.png', 'loading.gif',
    'ic_disponible.png', 'ic_disponible2.png',
];

const fonts = [
    'manrope_regular.ttf',
    'manrope_medium.ttf',
    'manrope_bold.ttf',
];

let ok = 0, miss = 0;

for (const f of images) {
    const src = path.join(srcDrawable, f);
    const dst = path.join(dstImg, f);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
        console.log('OK  img:', f);
        ok++;
    } else {
        console.log('MISS:   ', f);
        miss++;
    }
}

for (const f of fonts) {
    const src = path.join(srcFont, f);
    const dst = path.join(dstFont, f);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
        console.log('OK  font:', f);
        ok++;
    } else {
        console.log('MISS:   ', f);
        miss++;
    }
}

// Logo
const logo = String.raw`C:\Users\anciz\Music\APK\NequiGlitch\app\src\main\ic_logo-playstore.png`;
if (fs.existsSync(logo)) {
    fs.copyFileSync(logo, path.join(dstImg, 'ic_logo.png'));
    console.log('OK  logo: ic_logo.png');
    ok++;
}

console.log(`\nDONE: ${ok} copied, ${miss} missing`);
