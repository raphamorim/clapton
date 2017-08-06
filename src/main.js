const app = require('electron').remote

const playerElement = document.querySelector("#player")
const container = document.querySelector(".container")
const openFileElement = document.querySelector("#open-file")

function openVideoFile() {
  app.dialog.showOpenDialog(app.getCurrentWindow(), {
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