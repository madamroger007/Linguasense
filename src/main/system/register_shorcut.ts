import { BrowserWindow, globalShortcut } from "electron";

export function registerSystemShortcuts(win: BrowserWindow) {
  const shortcuts = [
    {
      key: 'CommandOrControl+Shift+S',
      channel: 'system:toggle-speech',
    },
    {
      key: 'CommandOrControl+Shift+T',
      channel: 'system:translate',
    },
  ];

  shortcuts.forEach(({ key, channel }) => {
    const ok = globalShortcut.register(key, () => {
      win.webContents.send(channel);
    });

    if (!ok) {
      console.warn(`[system] failed to register ${key}`);
    }
  });
}

export function unregisterSystemShortcuts() {
  globalShortcut.unregisterAll();
}
