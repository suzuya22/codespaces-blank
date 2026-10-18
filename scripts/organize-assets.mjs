import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'Wireframes', 'imagenes exportadas');
const destDir = path.join(root, 'public', 'images');

const subdirs = ['proyectos', 'assets', 'banners', 'logos', 'avatares'];
subdirs.forEach(sub => {
  fs.mkdirSync(path.join(destDir, sub), { recursive: true });
});

const mappings = [
  // Proyectos
  { src: 'Rectangle 33_1-007.png', dest: 'proyectos/cult-of-the-lamb.png' },
  { src: 'Rectangle 34-008.png', dest: 'proyectos/binding-of-isaac.png' },
  { src: 'Rectangle 11-003.png', dest: 'proyectos/night-in-the-woods.png' },
  { src: 'Rectangle 12-004.png', dest: 'proyectos/another-door.png' },
  { src: 'Rectangle 10_1-023.png', dest: 'proyectos/fox-girl-3d.png' },
  { src: 'Rectangle 10_2-025.png', dest: 'proyectos/retro-anime.png' },

  // Assets animados & 3D
  { src: 'Rectangle 9_2-027.png', dest: 'assets/chico-spritesheet.png' },
  { src: 'Rectangle 10_4-028.png', dest: 'assets/chica-spritesheet.png' },
  { src: 'Rectangle 10_5-029.png', dest: 'assets/animacion-caminar.png' },
  { src: 'Rectangle 9-021.png', dest: 'assets/modelo-3d-wireframe.png' },
  { src: 'Rectangle 10-022.png', dest: 'assets/modelo-3d-rig.png' },

  // Banners
  { src: 'Rectangle 33-001.png', dest: 'banners/hero-banner.png' },
  { src: 'Rectangle 29-020.png', dest: 'banners/perfil-banner.png' },
  { src: 'Rectangle 39-006.png', dest: 'banners/auth-banner.png' },

  // Logos
  { src: 'image 8-015.png', dest: 'logos/godot.png' },
  { src: 'pngwing.com 1-018.png', dest: 'logos/unity.png' },
  { src: 'pngwing.com (1) 1-016.png', dest: 'logos/unreal.png' },
  { src: 'image 6-035.png', dest: 'logos/google.png' },
  { src: 'image 7-036.png', dest: 'logos/discord.png' },
  { src: 'imagen_2025-08-11_235528372-Photoroom 1-009.png', dest: 'logos/redes-sociales.png' },

  // Avatares
  { src: 'Ellipse 4-019.png', dest: 'avatares/suzuya.png' },
  { src: 'Ellipse 16-010.png', dest: 'avatares/lauraart.png' },
  { src: 'Ellipse 17-011.png', dest: 'avatares/mateodev.png' },
  { src: 'Ellipse 18-012.png', dest: 'avatares/avatar-3.png' },
  { src: 'Ellipse 19-013.png', dest: 'avatares/avatar-4.png' },
  { src: 'Ellipse 20-014.png', dest: 'avatares/avatar-5.png' }
];

mappings.forEach(m => {
  const from = path.join(srcDir, m.src);
  const to = path.join(destDir, m.dest);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, to);
    console.log(`Copied ${m.src} -> ${m.dest}`);
  } else {
    console.warn(`File not found: ${m.src}`);
  }
});

console.log('Finished copying assets.');
