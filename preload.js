
// importing the modules from electron, require = import in js
// contextBridge: Tprovides APIs for securely exposing functionality from the main process to the renderer process.
// ipcMain: This module is used in the main process to listen for and handle inter-process communication (IPC) messages from renderer processes.
// ipcRenderer: This module is used in the renderer process to send IPC messages to the main process.
const { contextBridge, ipcMain, ipcRenderer } = require('electron');

// importing js file (to use its funstions and variables and all)
const Bridge = require('./viewscripts/bridge');

contextBridge.exposeInMainWorld('Bridge', Bridge);
