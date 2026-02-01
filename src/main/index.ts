import { app, shell, BrowserWindow, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const icon = join(__dirname, '../../resources/icon.png')
import './ipc/ai';
import './ipc/audio';
import './ipc/system';
import { registerSystemShortcuts, unregisterSystemShortcuts } from './system/register_shorcut';


app.commandLine.appendSwitch('enable-speech-input')
app.commandLine.appendSwitch('enable-speech-api')
app.commandLine.appendSwitch('use-fake-ui-for-media-stream') // auto allow mic (DEV)
app.commandLine.appendSwitch('disable-http-cache');
app.commandLine.appendSwitch('disable-background-networking');

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
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

  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.control && input.shift && input.code === 'KeyS') {
      mainWindow?.webContents.send('system:toggle-speech');
    }

    if (input.control && input.shift && input.code === 'KeyT') {
      mainWindow?.webContents.send('system:translate-active-window');
    }
  });

  // DEV / PROD loader
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow;
}

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

  const mainWindow = createWindow();
  registerSystemShortcuts(mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  unregisterSystemShortcuts();
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
