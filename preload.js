const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  readDir: (dirPath) => ipcRenderer.invoke('read-dir', dirPath),
  createFile: (filePath) => ipcRenderer.invoke('create-file', filePath),
  createDirectory: (dirPath) => ipcRenderer.invoke('create-directory', dirPath),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
})
