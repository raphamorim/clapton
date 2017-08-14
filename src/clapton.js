const remote = require('electron').remote
const shell = require('electron').shell

const path = require('path')
const WebTorrent = require('webtorrent')

const playerElement = document.querySelector('#player')
const containerElement = document.querySelector('.container')
const openFileElement = document.querySelector('#open-file')
const versionElement = document.querySelector('#version')
const videoSampleElement = document.querySelector('#video-sample')

const videoInfoElement = document.querySelector('#video-info')
const videoInfoThumbElement = document.querySelector('#video-info-thumb')

const linkTwitterElement = document.querySelector('#link-twitter')

const Clapton = {
  version: require('./package.json').version,
}

versionElement.textContent = Clapton.version

let PlayerInstance, ClientTorrentInstance

function playFromStream(torrentFile) {
  ClientTorrentInstance = new WebTorrent()
  // var magnetURI = 'magnet:?xt=urn:btih:D9870CA440CD79425D47E0EB4E2DEC564A9E94D9&dn=Deadpool%202016%20WEB-DL%201080p%20Legendado%20-%20WWW.THEPIRATEFILMES.COM&tr=udp%3a%2f%2ftracker.trackerfix.com%3a80%2fannounce'

  ClientTorrentInstance.add(torrentFile, function(torrent) {
    // console.log('Client is downloading:', torrent.infoHash)
    console.log(ClientTorrentInstance.progress)

    torrent.files.forEach(function(file) {
      // Display the file by appending it to the DOM. Supports video, audio, images, and
      // more. Specify a container element (CSS selector or reference to DOM node).
      if (file.path.indexOf('mp4') >= 0)
        return play(
          path.resolve(file._torrent.path, file.path)
        )
    })
  })
}

function play(filePath) {
  let config = {
    source: filePath[0],
    parent: playerElement,
    autoPlay: true,
    // poster: '',
    // chromeless: 'true',
    mediacontrol: {
      seekbar: "#2DC0D3",
      buttons: "#FC4C00"
    },
    hlsjsConfig: {
      enableWorker: true
    },
    plugins: [
      PlaylistPlugin
    ]
  }

  playerElement.classList.add('playing')
  containerElement.style.display = 'none'

  if (filePath.length > 1) {
    config.playlist = {
      sources: filePath.map(i => i = {source: i})
    }

    delete config.source
  }

  if (PlayerInstance) {
    PlayerInstance.configure(config)
  } else {
    PlayerInstance = new Clappr.Player(config)
  }

  videoSampleElement.remove()

  window.addEventListener('resize', resizePlayer.bind(this))
  document.addEventListener('webkitfullscreenchange', resizePlayer.bind(this))

  resizePlayer()
}

function resumePlayer(ev) {
  playerElement.classList.add('playing')
  containerElement.style.display = 'none'

  PlayerInstance.play()

  videoInfoElement.removeEventListener('click', resumePlayer)
}

function finishPlayer() {
  playerElement.classList.remove('playing')
  containerElement.style.display = 'block'

  let videoPath = path.basename(PlayerInstance._options.source)

  // TODO: create nodeElement
  videoInfoElement.innerHTML = `
    <p>RESUME:</p>
    <p>${videoPath}</p>
  `
  videoInfoElement.style.display = 'block'
  videoInfoThumbElement.style.display = 'block'

  videoInfoElement.addEventListener('click', resumePlayer)

  if (PlayerInstance)
    PlayerInstance.pause()
}

function openVideoFile() {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    // TODO: support 'mkv', 'avi'
    filters: [
      {
        name: 'Movies',
        extensions: [
          'mp4', 'webm', 'hls', 'mp3', 'jpg', 'png', 'gif', 'torrent'
        ]
      }
    ],
    properties: [ 'openFile', 'multiSelections' ]
  }, (fileNames) => {
    if (fileNames && fileNames.length) {
      if (fileNames[0].indexOf('torrent') >= 0)
        playFromStream(fileNames[0])
      else
        play(fileNames)
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

linkTwitterElement.addEventListener('click', openExternal)
openFileElement.addEventListener('click', openVideoFile)

key('⌘+o', (event, handler) => openVideoFile())

// Handle Preferences
// key('⌘+,', (event, handler) => )

key('esc', (event, handler) => finishPlayer())

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = function(ev) {
  play(ev.dataTransfer.files[0].path)
  ev.preventDefault()
}
