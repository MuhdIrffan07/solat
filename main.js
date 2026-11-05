const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900, 
        title: "Solat Time",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

    // BULLETPROOF ZOOM: Directly listens for the keyboard shortcuts
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.control || input.meta) {
            // Zoom In (Ctrl + '+' or Ctrl + '=')
            if (input.key === '+' || input.key === '=') {
                let currentZoom = mainWindow.webContents.getZoomLevel();
                mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
                event.preventDefault();
            } 
            // Zoom Out (Ctrl + '-')
            else if (input.key === '-') {
                let currentZoom = mainWindow.webContents.getZoomLevel();
                mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
                event.preventDefault();
            } 
            // Reset Zoom (Ctrl + '0')
            else if (input.key === '0') {
                mainWindow.webContents.setZoomLevel(0);
                event.preventDefault();
            }
        }
    });
}

app.whenReady().then(() => {
    createWindow();

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