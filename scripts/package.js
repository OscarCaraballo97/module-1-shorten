const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist'); 
const BUILD_DIR = path.join(ROOT_DIR, 'build');

const ZIP_NAME = 'shorten-lambda.zip';
const ZIP_PATH = path.join(BUILD_DIR, ZIP_NAME);

if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ No se encontró la carpeta dist en: ${DIST_DIR}`);
  console.error('   Asegúrate de correr "npm run build" (tsc) antes de empaquetar o de que build ejecute tsc.');
  process.exit(1);
}

if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

function createZip() {
  return new Promise((resolve, reject) => {
    console.log(`📦 Empaquetando lambda (module-1-shorten) → ${ZIP_PATH}`);

    const output = fs.createWriteStream(ZIP_PATH);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`✅ ZIP listo: ${ZIP_NAME} (${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on('error', (err) => {
      console.error('❌ Error al crear el ZIP:', err);
      reject(err);
    });

    archive.pipe(output);

    archive.directory(DIST_DIR, false);

   
    const NODE_MODULES_DIR = path.join(ROOT_DIR, 'node_modules');
    if (fs.existsSync(NODE_MODULES_DIR)) {
      console.log('   ➕ Incluyendo node_modules');
      archive.directory(NODE_MODULES_DIR, 'node_modules');
    }

    const PKG_JSON = path.join(ROOT_DIR, 'package.json');
    if (fs.existsSync(PKG_JSON)) {
      archive.file(PKG_JSON, { name: 'package.json' });
    }

    archive.finalize();
  });
}

createZip().catch(() => process.exit(1));
