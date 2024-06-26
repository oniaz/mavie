const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1010,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js')
      // preload: path.join(__dirname, 'preload.js'), // same thing really
    }
  });

  mainWindow.loadFile(path.join(__dirname, './views/index.html'));
  // mainWindow.webContents.openDevTools();

  // prevent ads lololol
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // garbage collection when closing the window - remove from memory
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.handle('getPopularFilms', async () => {
  const response = await fetch('https://api.npoint.io/2fba5056b01154250947');
  const body = await response.json();
  console.log(body[0]);
  return (body);
});

ipcMain.handle('getSearchFilms', async (event, movie) => {
  console.log('from the main getsearchfilms: ' + movie);
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

ipcMain.handle('getFilmInfo', async (event, imdb) => {
  console.log('from the main getfilminfo: ' + imdb);
  const apiUrl = `http://www.omdbapi.com/?apikey=f357aabe&i=${imdb}`;
  const response = await fetch(apiUrl);
  const body = await response.json();
  console.log(body);
  return (body);
});

// Get the directory where you want to store the JSON files
const userDataPath = path.join(app.getPath('userData'), 'data');
// Ensure the directory exists
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}
ipcMain.on('saveJsonHistory', (event, newData) => {
  console.log('from the main savejsonhist: ' + newData);
  let existingData;
  try {
    existingData = JSON.parse(fs.readFileSync(path.join(userDataPath, 'history.json')));
  } catch (error) {
    existingData = [];
  }
  const updatedData = existingData.concat(newData);
  const sData = JSON.stringify(updatedData);
  fs.writeFileSync(path.join(userDataPath, 'history.json'), sData);
  console.log('Data Saved to History');
});

ipcMain.handle('readHistory', () => {
  try {
    fileData = fs.readFileSync(path.join(userDataPath, 'history.json'));
    if (fileData.length === 0) {
      console.log('History file is empty');
      return [];
    }
    console.log('File data:', fileData);
    const existingData = JSON.parse(fileData);
    console.log('Data Read from History:', existingData);
    return (existingData);
  } catch (error) {
    console.error('Error reading history.json:', error);
    return ([]);
  }
});

ipcMain.on('deleteHistory', () => {
  try {
    fs.truncateSync(path.join(userDataPath, 'history.json'));
    console.log('History file truncated successfully');
  } catch (error) {
    console.error('Error truncating history.json:', error);
  }
});

ipcMain.on('saveJsonFav', (event, page, newData) => {
  console.log(`from the main savejson${page}: ` + newData);

  let existingData;
  try {
    existingData = JSON.parse(fs.readFileSync(path.join(userDataPath, `${page}.json`)));
  } catch (error) {
    existingData = [];
  }

  const isDuplicate = existingData.some(movie => movie.imdb === newData.imdb);
  if (isDuplicate) {
    console.log('Movie already exists in the fav JSON file. Not saving again.');
  } else {
    const updatedData = existingData.concat(newData);
    const sData = JSON.stringify(updatedData);
    fs.writeFileSync(path.join(userDataPath, `${page}.json`), sData);
    console.log(`Data Saved to ${page}`);
  }
});

ipcMain.handle('readFav', (event, page) => {
  console.log('hello from readfav');
  console.log(page);
  try {
    fileData = fs.readFileSync(path.join(userDataPath, `${page}.json`));
    if (fileData.length === 0) {
      console.log(`${page} file is empty`);
      return [];
    }
    const existingData = JSON.parse(fileData);
    console.log(`Data Read from ${page}`, existingData);
    return (existingData);
  } catch (error) {
    console.error(`Error reading ${page}.json:`, error);
    return ([]);
  }
});

ipcMain.on('removeFilm', (event, page, imdb) => {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(userDataPath, `${page}.json`)));
    for (let i = 0; i < data.length; i++) {
      if (data[i].imdb === imdb) {
        data.splice(i, 1);
        break;
      }
    }

    const sData = JSON.stringify(data);
    fs.writeFileSync(path.join(userDataPath, `${page}.json`), sData);
    console.log(`Removed movie with imdb ${imdb} and updated ${page}`);
  } catch (error) {
    console.log(`Error reading ${page}`, error);
  }
});

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
