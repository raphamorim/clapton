const {remote, shell} = require('electron')

const playerElement = document.querySelector("#player")
const containerElement = document.querySelector(".container")
const openFileElement = document.querySelector("#open-file")
const openTorrentElement = document.querySelector("#open-torrent")
const versionElement = document.querySelector("#version")

const linkTwitterElement = document.querySelector("#link-twitter")
const linkContributeElement = document.querySelector("#link-contribute")

const version = require('./package.json').version
versionElement.textContent = version

function play(filePath) {
  playerElement.classList.add('playing')
  containerElement.style.display = 'none'

  var player = new Clappr.Player({
    source: filePath,
    parentId: "#player"
  })

  window.addEventListener('resize', function(e){
    player.resize({
      height: window.innerHeight,
      width: window.innerWidth,
    })
  })

  player.resize({
    height: window.innerHeight,
    width: window.innerWidth,
  })
}

function openVideoFile() {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    filters: [
      { name: 'Movies', extensions: [ 'mkv', 'avi', 'mp4' ] }
    ],
    properties: [ 'openFile' ]
  }, (fileNames) => {
    if (fileNames && fileNames.length) {
      play(fileNames[0])
    }
  })
}

function openExternal(e) {
  event.preventDefault()
  shell.openExternal(e.target.href)
}

linkContributeElement.addEventListener('click', openExternal)

linkTwitterElement.addEventListener('click', openExternal)

openFileElement.addEventListener('click', openVideoFile)

openTorrentElement.addEventListener('click', () => {
  alert('Feature under development!')
})

key('⌘+o', (event, handler) => {
  // TODO: Multiple files and diretory
  openVideoFile()
})