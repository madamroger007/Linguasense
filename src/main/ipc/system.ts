import { app, ipcMain } from 'electron';

ipcMain.handle('system:set-auto-run', (_event, enable: boolean) => {
  try {
    app.setLoginItemSettings({
      openAtLogin: enable,
      openAsHidden: true,
    });
    return { success: true };
  } catch (err) {
    console.error('[auto-run] failed', err);
    return { success: false, error: String(err) };
  }
});
