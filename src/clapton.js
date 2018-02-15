const { dialog, getCurrentWindow } = require('electron').remote
const shell = require('electron').shell

const path = require('path')
const tryRequire = require('try-require')
const WebTorrent = require('webtorrent')
const Player = require('./src/Player.js')

const playerElement = document.querySelector('#player')
const containerElement = document.querySelector('.container')
const videoInfoElement = document.querySelector('#video-info')

let PlayerInstance, ClientTorrentInstance

let Config = {
  defaults: {
    theaterSource: null,
    extendStyle: null,
  },
  version: require('./package.json').version,
}

function InitClapton() {
  const versionElement = document.querySelector('#version')
  versionElement.textContent = Config.version

  initListeners()

  const claptonConfig = tryRequire(`${process.env['HOME']}/claptonconfig.json`)
  if (!claptonConfig)
    return

  Config = Object.assign({}, Config, claptonConfig)
  const { theaterSource, extendStyle } = Config.defaults

  if (theaterSource) {
    const videoSampleElement = document.querySelector('#video-sample')
    videoSampleElement.pause()
    const sourceElement = document.createElement('source')
    sourceElement.setAttribute('src', theaterSource)
    videoSampleElement.insertBefore(sourceElement, videoSampleElement.children[0])
    videoSampleElement.load()
    videoSampleElement.play()
  }

  if (extendStyle) {
    nautilus.config({
      paths: {
        extendedStyle: extendStyle
      }
    })

    nautilus(['extendedStyle'])
  }
}

function hasExtension(filePath) {
  const torrentExtensions = ['ogv', 'mkv', 'mp4', 'webm', 'hls']
  for (var i = torrentExtensions.length - 1; i >= 0; i--) {
    if (filePath.includes(torrentExtensions[i])) {
      return true
    }
  }

  return false
}

function playFromStream(torrentFile) {
  const statusElement = document.querySelector('#status')

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
      if (hasExtension(file.path))
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
    super(options)
  }
}

function play(filePaths) {
  const videoSampleElement = document.querySelector('#video-sample')

  let config = {
    source: filePaths[0],
    parent: playerElement,
    autoPlay: true,
    poster: 'assets/images/video-info-thumb.png',
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

  let files = filePaths.join()
  if (files.includes('mkv')) {
    PlayerInstance = new Player(config)
    PlayerInstance.play()
  } else {
    if (PlayerInstance) {
      if (!PlayerInstance._sourceElement)
        PlayerInstance.configure(config)
      else {
        PlayerInstance = PlayerInstance.clean()
        return play(filePaths)
      }
    } else {
      PlayerInstance = new Clappr.Player(config)
    }
  }

  if (videoSampleElement)
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

function isPlaying(ev) {
  return playerElement.classList.value.search('playing') >= 0
}

function togglePlayer(ev) {
  isPlaying() ? stopPlayer() : resumePlayer()
}

function stopPlayer(ev, target) {
  const videoInfoThumbElement = document.querySelector('#video-info-thumb')

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

function openVideoFiles(ev, defaultPath) {
  const dialogConfig = {
    filters: [
      {
        name: 'Movies',
        extensions: [
          'ogv', 'mkv', 'mp4', 'webm', 'hls',
          'mp3', 'jpg', 'png', 'gif', 'torrent'
        ]
      }
    ],
    properties: [ 'openFile', 'createDirectory', 'multiSelections' ]
  }

  if (defaultPath)
    dialogConfig['defaultPath'] = defaultPath

  dialog.showOpenDialog(getCurrentWindow(), dialogConfig, (fileNames) => {
    if (fileNames && fileNames.length) {
      if (fileNames[0].includes('torrent'))
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

function openExternal(ev) {
  event.preventDefault()
  shell.openExternal(ev.target.href)
}

function toggleFullScreen(ev) {
  if (!document.webkitFullscreenElement) {
    document.documentElement.webkitRequestFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

function initListeners() {
  const linkTwitterElement = document.querySelector('#link-twitter')
  const openFileElement = document.querySelector('#open-file')

  linkTwitterElement.addEventListener('click', openExternal)
  openFileElement.addEventListener('click', openVideoFiles)

  document.ondragover = document.ondrop = (ev) => {
    ev.preventDefault()
  }

  document.body.ondrop = function(ev) {
    // TODO: map files
    play([ev.dataTransfer.files[0].path])
    ev.preventDefault()
  }

  // Handle OpenFile
  key('⌘+o', openVideoFiles)

  // Handle Preferences
  // key('⌘+,',)

  // StopPlayer
  key('esc', stopPlayer)

  // Handle FullScreen
  key('⌘+f', toggleFullScreen)

  // Toggle Player
  key('ctrl+space', togglePlayer)

}

InitClapton()
