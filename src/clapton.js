const remote = require('electron').remote
const shell = require('electron').shell

const playerElement = document.querySelector('#player')
const containerElement = document.querySelector('.container')
const openFileElement = document.querySelector('#open-file')
const openTorrentElement = document.querySelector('#open-torrent')
const versionElement = document.querySelector('#version')

const linkTwitterElement = document.querySelector('#link-twitter')
const linkContributeElement = document.querySelector('#link-contribute')

const version = require('./package.json').version
versionElement.textContent = version

let PlayerInstance

function play(filePath) {
  playerElement.classList.add('playing')
  containerElement.style.display = 'none'

  PlayerInstance = new Clappr.Player({
    source: filePath,
    parentId: "#player"
  })

  window.addEventListener('resize', resizePlayer.bind(this))
  document.addEventListener('webkitfullscreenchange', resizePlayer.bind(this))

  resizePlayer()
}

function openVideoFile() {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    // TODO: 'mkv', 'avi'
    filters: [
      {
        name: 'Movies',
        extensions: [
          'mp4', 'webm', 'hls', 'mp3', 'jpg', 'png', 'gif'
        ]
      }
    ],
    properties: [ 'openFile' ]
  }, (fileNames) => {
    if (fileNames && fileNames.length) {
      play(fileNames[0])
    }
  })
}

function resizePlayer() {
  PlayerInstance.resize({
    height: window.innerHeight,
    width: window.innerWidth,
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

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = function(ev) {
  play(ev.dataTransfer.files[0].path)
  ev.preventDefault()
}