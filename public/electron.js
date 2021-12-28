const { app, BrowserWindow } = require('electron')

const filter = {
    urls: ['https://*.webullfintech.com/*', 'https://*.webullfinance.com/*', 'https://*.webull.com/*']
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.webContents.session.webRequest.onBeforeSendHeaders(
        filter,
        (details, callback) => {
            details.requestHeaders.Origin = 'https://app.webull.com'
            callback({requestHeaders: details.requestHeaders})
        }
    )

    win.webContents.session.webRequest.onHeadersReceived(
        filter,
        (details, callback) => {
            details.responseHeaders['access-control-allow-origin'] = [
                'http://localhost:3000' // URL your local electron app hosted
            ]
        callback({ responseHeaders: details.responseHeaders })
        }
    )

    win.loadURL("http://localhost:3000") // change for production
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
