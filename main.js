const { app, BrowserWindow } = require('electron')

const { resolve } = require('path')
const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 300,
    height: 600,
    width: 800,
    resizable: true,
    movable: true,
    center: true,
    //macOnly
    titleBarStyle: 'hidden-inset',
    title: 'Clapton',
    backgroundColor: '#E88B8C',
    // we want to go frameless on windows and linux
    frame: process.platform === 'darwin',
    transparent: true,
    hasShadow: true,
    debug: false,
    darkTheme: true,
    vibrancy: 'ultra-dark',
    acceptFirstMouse: true,
    show: false,
    icon: resolve(__dirname + '/assets/images/icon.icns')
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'clapton.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

if (app) {
  app.on('ready', createWindow)

  app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function() {
    if (mainWindow === null) {
      createWindow()
    }
  })
}
