const {app, BrowserWindow, session, screen} = require("electron");
const path = require("path");

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    const window = new BrowserWindow({
        width: Math.floor(width * 0.37),
        height: Math.floor(height * 0.9),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'static/script/preload_loginNoticeBanner.js')
        },
    });
    // window.loadFile(path.join(__dirname, 'login.html'))
    window.loadURL('https://roblox.com')
    window.webContents.openDevTools()
    window.webContents.insertCSS(`
        body {
            position: static;
            height: 100vh
        }

        #externalPreloadBannerNotification {
            width: 100%;
            position: fixed;
            bottom: 0;
            z-index: 9999;
        }`
    )
}

app.whenReady().then(() => {
    createWindow()
})

