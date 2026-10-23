const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const H = 'http://127.0.0.1:11434';
const SYS = `You translate a player's wish into JSON for a 3D sandbox FPS game. Reply ONLY with one JSON object, no text.
Schema: {"kind":"weapon"|"spawn"|"rain","name":"short name in Portuguese","projectile":E,"entity":E}
Use "projectile" only when kind is weapon (the ammo the weapon fires). Use "entity" when kind is spawn (appears in front of the player) or rain (falls from the sky).
E = {"color":"#rrggbb","glow":"#rrggbb" or null,"size":0.3-4 (1 = normal),"shape":"sphere"|"box"|"cylinder"|"humanoid","explodes":true/false,"fly":true/false,"jump":true/false,"run":true/false,"emit":E or null,"rain":E or null}
Optional extra fields inside E (omit when not needed): boom (explosion power 0.5-5), count (how many copies fall when this E is the rain, 1-30), gravity (1 normal, 0 floats, negative rises), bounce, blackhole (turns into a black hole that sucks the map and creatures for 6s when it lands, dies or hits), clone (1-4: splits into 2 copies when it dies or hits), teleport (blinks around), trail (glowing particle trail), grow, speed (projectile speed 10-120), rate (ms between shots 60-1000), pellets (shots per trigger 1-12, shotgun). Weapon fields (speed, rate, pellets) go inside "projectile".
Example 2 wish: a shotgun that shoots bouncing ice balls that become black holes. Answer: {"kind":"weapon","name":"Escopeta de gelo","projectile":{"color":"#9fe8ff","glow":"#38c8ff","size":0.7,"shape":"sphere","explodes":false,"bounce":true,"blackhole":true,"pellets":6,"rate":600,"speed":50,"emit":null,"rain":null}}
Meaning: explodes = blows up (projectiles explode on impact, creatures explode near the player, items explode after landing). emit = something it drops or shoots every ~2 seconds (nest E inside E). rain = what pours from the sky where a projectile hits. humanoid = people, monsters, creatures, animals (they chase the player). run = fast chaser.
Rules: kind weapon if the wish is a gun/weapon/launcher; kind rain if things fall from the sky; otherwise spawn. Be literal and creative, never refuse. Pick colors that match the words (poop #6b4423, banana #ffe135, radioactive glow #39ff14, fire #ff4400, ice #9fe8ff, gold #ffd700).
Example wish: a gun that shoots soft poop that explodes on the wall into a rain of radioactive humanoid bananas that poop radioactive coconuts that explode.
Example answer: {"kind":"weapon","name":"Lanca-bosta","projectile":{"color":"#6b4423","glow":null,"size":1,"shape":"sphere","explodes":true,"fly":false,"jump":false,"run":false,"emit":null,"rain":{"color":"#ffe135","glow":"#39ff14","size":1,"shape":"humanoid","explodes":false,"fly":false,"jump":false,"run":true,"emit":{"color":"#6b4423","glow":"#39ff14","size":0.6,"shape":"sphere","explodes":true,"fly":false,"jump":false,"run":false,"emit":null,"rain":null},"rain":null}}}`;
function createWindow() {
  const w = new BrowserWindow({
    width: 1280, height: 720, backgroundColor: '#07031a', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  w.loadFile('index.html');
  w.webContents.on('before-input-event', (e, i) => {
    if (i.key === 'F11' && i.type === 'keyDown') w.setFullScreen(!w.isFullScreen());
  });
}
ipcMain.handle('status', async () => {
  try { const r = await fetch(H + '/api/tags', { signal: AbortSignal.timeout(2500) }); return r.ok; } catch { return false; }
});
ipcMain.handle('ollama', async (_e, text, model) => {
  const r = await fetch(H + '/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(90000),
    body: JSON.stringify({ model, stream: false, format: 'json', options: { temperature: 0.3 },
      messages: [{ role: 'system', content: SYS }, { role: 'user', content: text }] })
  });
  if (!r.ok) throw new Error(await r.text());
  const d = await r.json();
  return JSON.parse(d.message.content);
});
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
