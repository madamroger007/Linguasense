import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { is } from '@electron-toolkit/utils';

let popupWindow: BrowserWindow | null = null;
let autoCloseTimer: NodeJS.Timeout | null = null;

export function showTranslatePopup(text: string) {
  const { x, y } = screen.getCursorScreenPoint();
  const display = screen.getPrimaryDisplay().workArea;

  const WIDTH = 360;
  const HEIGHT = 160;

  const safeX = Math.min(x + 12, display.width - WIDTH - 8);
  const safeY = Math.min(y + 12, display.height - HEIGHT - 8);

  popupWindow?.close();
  popupWindow = null;

  popupWindow = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    x: safeX,
    y: safeY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
    },
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    popupWindow.loadURL(
      `${process.env.ELECTRON_RENDERER_URL}#/translate-popup`
    );
  } else {
    popupWindow.loadFile(
      path.join(__dirname, '../renderer/index.html'),
      { hash: 'translate-popup' }
    );
  }

  popupWindow.webContents.once('did-finish-load', () => {
    popupWindow?.showInactive();
    popupWindow?.setOpacity(0);

    // fade in
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity += 0.08;
      popupWindow?.setOpacity(Math.min(opacity, 1));
      if (opacity >= 1) clearInterval(fadeIn);
    }, 16);

    popupWindow?.webContents.send('system:set-text', text);
  });

  autoCloseTimer = setTimeout(() => fadeOutAndClose(), 15000);
}

export function pinTranslatePopup() {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
}

function fadeOutAndClose() {
  if (!popupWindow) return;

  let opacity = 1;
  const fadeOut = setInterval(() => {
    opacity -= 0.08;
    popupWindow?.setOpacity(Math.max(opacity, 0));
    if (opacity <= 0) {
      clearInterval(fadeOut);
      popupWindow?.close();
      popupWindow = null;
    }
  }, 16);
}
