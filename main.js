const { resolve } = require('path')
const path = require('path')
const url = require('url')
const { app, BrowserWindow } = require('electron')

const { appUpdater } = require('./src/auto-update')
const isDev = require('electron-is-dev')

/* Handling squirrel.windows events on windows
only required if you have build the windows with target squirrel. For NSIS target you don't need it. */
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 640,
    minHeight: 480,
    height: 620,
    width: 800,
    resizable: true,
    movable: true,
    center: true,
    //macOnly
    titleBarStyle: 'hidden-inset',
    title: 'Clapton',
    backgroundColor: '#FFFBD5',
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

  // Open the DevTools
  if (isDev)
    mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  const page = mainWindow.webContents

  page.once('did-frame-finish-load', () => {
    if (process.platform === 'darwin' && !isDev)
        appUpdater()
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
