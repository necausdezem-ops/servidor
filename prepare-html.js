const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = __dirname;
const sourceDir = path.join(root, 'source');
const parts = [
  fs.readFileSync(path.join(sourceDir, 'index.part1.b64'), 'utf8').trim(),
  fs.readFileSync(path.join(sourceDir, 'index.part2.b64'), 'utf8').trim()
];
const html = zlib.gunzipSync(Buffer.from(parts.join(''), 'base64')).toString('utf8');
if (!html.startsWith('<!DOCTYPE html>') || !html.includes('node_modules/three/build/three.min.js')) {
  throw new Error('A fonte compactada do jogo está incompleta ou inválida.');
}
fs.writeFileSync(path.join(root, 'index.html'), html, 'utf8');
console.log('index.html preparado com sucesso.');
