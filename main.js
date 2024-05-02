const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const { ipcMain } = require("electron");
const { net } = require("electron");
const axios = require("axios");

let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js")
      // preload: path.join(__dirname, 'preload.js'), // same thing really
    },
  });

  mainWindow.loadFile(path.join(__dirname, './views/index.html'));
  mainWindow.webContents.openDevTools();

  // prevent ads lololol
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: "deny" };
  });

  //garbage collection when closing the window - remove from memory
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};


ipcMain.handle("getPopularFilms", async () => {
  const response = await fetch("https://api.npoint.io/2fba5056b01154250947");
  const body = await response.json();
  console.log(body[0]);
  return (body);
});

ipcMain.handle("getSearchFilms", async (event, movie) => {
  console.log("from the main: " + movie);
  const apiUrl = `http://www.omdbapi.com/?apikey=f357aabe&s=${movie}&type=movie`;
  const response = await fetch(apiUrl);
  const body = await response.json();
  if (body.Search) {
    console.log(body.Search[0]);
    return (body.Search);
  } else {
    console.log(body);
    return (body);
  }
});

ipcMain.handle("getFilmInfo", async (event, imdb) => {
  console.log("from the main: " + imdb);
  const apiUrl = `http://www.omdbapi.com/?apikey=f357aabe&i=${imdb}`;
  const response = await fetch(apiUrl);
  const body = await response.json();
  console.log(body);
  return (body);
});

// idk what those are
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

