const electron = require('electron');
const { ipcMain } = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;
let child;

function createWindow(){
  mainWindow = new BrowserWindow({
    frame:isDev ? true: false, 
    show:false,
    menu:isDev ? true:false,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev ? true:false,
    }});
  //mainWindow.setMenu(isDev ? true: null);
  mainWindow.maximize();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.once("ready-to-show", () =>{
    mainWindow.show();
    mainWindow.webContents.session.clearCache()
    child = new BrowserWindow({ parent: mainWindow });
    child.show();
  })


  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('fechar', () => {
  app.quit();
})