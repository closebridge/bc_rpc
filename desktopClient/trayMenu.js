const { Tray, Menu, nativeImage, app } = require('electron')

function startTray() {
    const imgPath = 'desktopClient/gui/static/tray'
    const iconPath = process.platform === 'win32' ?
        `${imgPath}/icon-tray.ico` :
        `${imgPath}/icon-tray.png`

    const trayIcon = [ // tray, setting, about, close
        nativeImage.createFromPath(iconPath),
        nativeImage.createFromPath(`${imgPath}/setting.png`),
        nativeImage.createFromPath(`${imgPath}/info.png`),
        nativeImage.createFromPath(`${imgPath}/close.png`)
    ]

    const tray = new Tray(trayIcon[0])

    const menu = Menu.buildFromTemplate([
        {icon: trayIcon[1] ,label: 'setting', click: () => {return true}},
        {icon: trayIcon[2] ,label: 'info', click: () => {return true}},
        {type: 'separator'},
        {icon: trayIcon[3] ,label: 'quit', click: () => {app.quit()}}
    ])

    tray.setContextMenu(menu)
}

module.exports = startTray