import os, shutil

src_drawable = r'C:\Users\anciz\Music\APK\NequiGlitch\app\src\main\res\drawable'
src_font     = r'C:\Users\anciz\Music\APK\NequiGlitch\app\src\main\res\font'
dst_img      = r'C:\Users\anciz\Documents\app\assets\img'
dst_font     = r'C:\Users\anciz\Documents\app\assets\fonts'

os.makedirs(dst_img, exist_ok=True)
os.makedirs(dst_font, exist_ok=True)

images = [
    'fondo.png', 'clavefondopage.png', 'homenequifondo.png',
    'tu_plata.png', 'tres_botones.png', 'bre_b_icon.png',
    'mi_negocio_icon.png', 'tigo_icon.png', 'wom_icon.png',
    'tienda_virtual_icon.png', 'bolsillos_icon.png', 'claro_icon.png',
    'mas_servicios_icon.png', 'heart.png', 'edit.png',
]
fonts = ['manrope_regular.ttf', 'manrope_medium.ttf', 'manrope_bold.ttf']

for f in images:
    s = os.path.join(src_drawable, f)
    d = os.path.join(dst_img, f)
    if os.path.exists(s):
        shutil.copy2(s, d)
        print(f'OK img: {f}')
    else:
        print(f'MISS:   {f}')

for f in fonts:
    s = os.path.join(src_font, f)
    d = os.path.join(dst_font, f)
    if os.path.exists(s):
        shutil.copy2(s, d)
        print(f'OK font: {f}')
    else:
        print(f'MISS:   {f}')

logo = r'C:\Users\anciz\Music\APK\NequiGlitch\app\src\main\ic_logo-playstore.png'
if os.path.exists(logo):
    shutil.copy2(logo, os.path.join(dst_img, 'ic_logo.png'))
    print('OK logo')

print('DONE')
