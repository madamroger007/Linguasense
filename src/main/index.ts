import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

/**
 * =========================
 * CHROMIUM FLAGS (WAJIB DI ATAS)
 * =========================
 */
app.commandLine.appendSwitch('enable-speech-input')
app.commandLine.appendSwitch('enable-speech-api')
app.commandLine.appendSwitch('use-fake-ui-for-media-stream') // auto allow mic (DEV)

/**
 * =========================
 * CREATE WINDOW
 * =========================
 */
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'), // sesuai output build kamu
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // DEV / PROD loader
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/**
 * =========================
 * APP READY
 * =========================
 */
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // Auto allow mic permission (DEV)
  session.defaultSession.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      if (permission === 'media') {
        callback(true)
      } else {
        callback(false)
      }
    }
  )

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

/**
 * =========================
 * APP QUIT
 * =========================
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
