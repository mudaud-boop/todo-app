const { app, BrowserWindow, Notification, ipcMain, globalShortcut } = require('electron')
const path = require('path')

// Check if running in dev mode (loading from localhost)
const isDev = !app.isPackaged

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a2e'
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    // Open DevTools in dev mode
    mainWindow.webContents.openDevTools({ mode: 'right' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Keyboard shortcut to toggle DevTools (Cmd+Option+I on Mac, Ctrl+Shift+I on Windows/Linux)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if ((input.meta || input.control) && input.shift && input.key.toLowerCase() === 'i') {
      mainWindow.webContents.toggleDevTools()
    }
  })

  // Handle notification requests from renderer
  ipcMain.handle('show-notification', (event, { title, body }) => {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: title,
        body: body,
        silent: false
      })

      notification.on('click', () => {
        mainWindow.show()
        mainWindow.focus()
      })

      notification.show()
      return true
    }
    return false
  })

  // Check if notifications are supported
  ipcMain.handle('notifications-supported', () => {
    return Notification.isSupported()
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
