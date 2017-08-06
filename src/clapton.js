const {remote, shell} = require('electron')

const playerElement = document.querySelector("#player")
const container = document.querySelector(".container")
const openFileElement = document.querySelector("#open-file")

const linkTwitterElement = document.querySelector(".link-twitter")
const linkContributeElement = document.querySelector(".link-contribute")

linkContributeElement.addEventListener('click', function(e) {
  event.preventDefault()
  shell.openExternal(e.target.href)
  return false
})

linkTwitterElement.addEventListener('click', function(e) {
  event.preventDefault()
  shell.openExternal(e.target.href)
  return false
})

function openVideoFile() {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    filters: [
      { name: 'Movies', extensions: [ 'mkv', 'avi', 'mp4' ] }
    ],
    properties: [ 'openFile' ]
  }, (fileNames) => {
    if (fileNames && fileNames.length) {
      playerElement.classList.add('playing')
      container.style.display = 'none'

      var player = new Clappr.Player({
        source: fileNames[0],
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
  })
}

openFileElement.addEventListener('click', openVideoFile)

key('⌘+o', (event, handler) => {
  // TODO: Multiple files and diretory
  openVideoFile()
})