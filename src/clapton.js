const remote = require('electron').remote
const shell = require('electron').shell

const path = require('path')
const WebTorrent = require('webtorrent')

const playerElement = document.querySelector('#player')
const statusElement = document.querySelector('#status')
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

    function updateTorrentProgress() {
      statusElement.textContent = Math.floor(ClientTorrentInstance.progress * 100) + '%'

      requestIdleCallback(updateTorrentProgress)
    }

    requestIdleCallback(updateTorrentProgress)
    statusElement.classList.add('downloading')

    torrent.files.forEach(function(file) {
      if (file.path.indexOf('mp4') >= 0)
        return play(
          [
            path.resolve(file._torrent.path, file.path)
          ]
        )
    })
  })
}

 class MyMediaControl extends Clappr.MediaControl {
  get template() {
    return Clappr.template(
      `<div>My HTML here based on clappr/src/components/media_control/public/media-control.html</div>`
    )
  }
  get stylesheet () {
    return Clappr.Styler.getStyleFor(
      `.my-css-class { /* based on clappr/src/components/media_control/public/media-control.scss */ }`
    )
  }
  constructor(options) {
      super(options);
  }
}

function play(filePaths) {
  let config = {
    source: filePaths[0],
    parent: playerElement,
    autoPlay: true,
    poster: 'assets/images/video-info-thumb.png',
    // chromeless: 'true',
    mediacontrol: {
      seekbar: "#2DC0D3",
      buttons: "#FC4C00"
    },
    exitFullscreenOnEnd: false,
    hlsjsConfig: {
      enableWorker: true
    },
    plugins: [
      PlaylistPlugin,
      PlaybackRatePlugin
    ],
    playbackRateConfig: {
      defaultValue: '1.0',
      options: [
        {value: '0.5', label: '0.5x'},
        {value: '1.0', label: '1x'},
        {value: '2.0', label: '2x'},
        {value: '5.0', label: '5x'}
      ]
    },
  }

  playerElement.classList.add('playing')
  containerElement.style.display = 'none'

  if (Array.isArray(filePaths) && filePaths.length > 1) {
    config.playlist = {
      sources: filePaths.map(i => i = {source: i})
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
