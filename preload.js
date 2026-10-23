const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  ollama: (t, m) => ipcRenderer.invoke('ollama', t, m),
  status: () => ipcRenderer.invoke('status')
});
