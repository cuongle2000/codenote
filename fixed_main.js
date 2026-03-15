const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')
const fs = require('fs')
const { readFile, readdir, writeFile, mkdir } = require('fs/promises')

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (BrowserWindow.getAllWindows().length > 0) {
      const mainWindow = BrowserWindow.getAllWindows()[0]
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Ensure projects directory exists
const projectsDir = path.join(__dirname, 'projects')
mkdir(projectsDir, { recursive: true }).catch(console.error)

// Handle save file request
ipcMain.handle('save-file', async (event, filePath, content) => {
  try {
    await writeFile(filePath, content)
    return { success: true }
  } catch (error) {
    console.error('Error saving file:', error)
    return { success: false, error: error.message }
  }
})

// Handle open file request
ipcMain.handle('open-file', async (event, filePath) => {
  try {
    const data = await readFile(filePath, 'utf8')
    return data
  } catch (error) {
    console.error('Error opening file:', error)
    return null
  }
})

// Handle read directory request
ipcMain.handle('read-dir', async (event, dirPath) => {
  try {
    // If dirPath is empty or '.', use projects directory
    const targetPath = dirPath === '.' || dirPath === '' ? projectsDir : dirPath
    const items = await readdir(targetPath, { withFileTypes: true })
    const files = items.map(item => ({
      name: item.name,
      path: path.join(targetPath, item.name),
      isDirectory: item.isDirectory()
    }))
    return files
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
})

// Handle create file request
ipcMain.handle('create-file', async (event, filePath) => {
  try {
    // If filePath is relative to projects directory, make it absolute
    const absFilePath = path.isAbsolute(filePath) ? filePath : path.join(projectsDir, filePath)
    
    // Create parent directories if they don't exist
    const dirPath = path.dirname(absFilePath)
    await mkdir(dirPath, { recursive: true })
    
    // Create the file
    await writeFile(absFilePath, '')
    return { success: true }
  } catch (error) {
    console.error('Error creating file:', error)
    return { success: false, error: error.message }
  }
})

// Handle create directory request
ipcMain.handle('create-directory', async (event, dirPath) => {
  try {
    // If dirPath is relative to projects directory, make it absolute
    const absDirPath = path.isAbsolute(dirPath) ? dirPath : path.join(projectsDir, dirPath)
    
    await mkdir(absDirPath, { recursive: true })
    return { success: true }
  } catch (error) {
    console.error('Error creating directory:', error)
    return { success: false, error: error.message }
  }
})

// Handle show save dialog
ipcMain.handle('show-save-dialog', async (event, options) => {
  return dialog.showSaveDialog(options)
})

// Handle show open dialog
ipcMain.handle('show-open-dialog', async (event, options) => {
  return dialog.showOpenDialog(options)
})