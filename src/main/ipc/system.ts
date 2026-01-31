import { clipboard, ipcMain } from 'electron';
import { showTranslatePopup, pinTranslatePopup } from '../system/translate_popup';


ipcMain.on('system:write-clipboard', (_, text: string) => {
  clipboard.writeText(text);
  showTranslatePopup(text);
});
ipcMain.on('popup:pin', () => {
  pinTranslatePopup();
});
