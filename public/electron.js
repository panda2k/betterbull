const { app, BrowserWindow } = require('electron')

const url = 'http://localhost:3000'

const filter = {
    urls: ['https://*.webullfintech.com/*', 'https://*.webullfinance.com/*', 'https://*.webull.com/*']
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            partition: 'persist:main'
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
                url // URL your local electron app hosted
            ]
        callback({ responseHeaders: details.responseHeaders })
        }
    )

    win.loadURL(url) // change for production
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
