const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Used by all scripts except create_account.js to get the encryption key
// global.username is only being set and not used
global.username = '';
global.key = '';

const userDataPath = app.getPath('userData');
const loginsFilePath = path.join(userDataPath, '.logins.csv');

// Ensure the CSV file exists
if (!fs.existsSync(loginsFilePath)) {
    fs.writeFileSync( // Create file
      loginsFilePath, 
      "123,123,7E7DF0A598E9FDFFD01C65F4FC14E5D75F010DE6694300C237501712310E77AA\n" // Default account for testing
    ); 
}

// IPC handler to read the logins file
ipcMain.handle('read-logins-file', async () => {
  return fs.readFileSync(loginsFilePath, 'utf8');
});

ipcMain.handle('write-logins-file', async (event, data) => {
fs.writeFileSync(loginsFilePath, data, 'utf8');
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
app.quit();
}

const createWindow = () => {
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  icon: 'electron-encryption',
  autoHideMenuBar: true, 
  webPreferences: {
    frame: false,
    preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Optionally disable context isolation for simplicity
    },
  });

  // Prevent Developer Tools from opening
  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools(); // Close dev tools if opened
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
};

// IPC handlers to set the global variables
ipcMain.on('set-username', (event, username) => {
  global.username = username;
  console.log(`Username set to: ${global.username}`);
});

ipcMain.on('set-key', (event, key) => {
  global.key = key;
  console.log(`Key set to: ${global.key}`);
});

// IPC handlers to set the global variables
ipcMain.on('get-username', (event) => {
  event.returnValue = global.username;
});

ipcMain.on('get-key', (event) => {
  event.returnValue = global.key;
});

ipcMain.handle('show-save-dialog-encrypt', async (event) => {
  const defaultPath = app.getPath('documents');
  const defaultSavePath = path.join(defaultPath, 'encrypted_file');
  const result = await dialog.showSaveDialog({

    title: "Save Encrypted File",
    defaultPath: defaultSavePath,
    filters: [
      { name: 'Binary Files', extensions: ['bin'] },
      { name: 'All Files', extensions: ['*'] }
  ]
  });
  return result.filePath;
});

ipcMain.handle('show-save-dialog-decrypt', async (event, fileName) => {
  const defaultPath = app.getPath('documents');
  const defaultSavePath = path.join(defaultPath, fileName || 'decrypted_file'); // Use fileName or fallback

  const result = await dialog.showSaveDialog({
    title: "Save Decrypted File",
    defaultPath: defaultSavePath,
    filters: [
      { name: 'Binary Files', extensions: ['bin'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  return result.filePath; // Return the selected file path
});




app.whenReady().then(() => {
  createWindow();

  app.on('ready', () => {
    const userDataPath = app.getPath('userData');
    const loginsFilePath = path.join(userDataPath, '.logins.csv');

    // Ensure the file exists
    if (!fs.existsSync(loginsFilePath)) {
        fs.writeFileSync(loginsFilePath, ''); // Create an empty file
    }

    // Optionally, handle file operations through IPC
    ipcMain.handle('read-logins-file', async () => {
        return fs.readFileSync(loginsFilePath, 'utf8');
    });

    ipcMain.handle('write-logins-file', async (event, data) => {
        fs.writeFileSync(loginsFilePath, data, 'utf8');
    });

    // Your app's other initialization code
});

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
