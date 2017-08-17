class Player {
  constructor(config) {
    this.config = config
  }

  play() {
    const { parent, source } = this.config
    const videoElement = document.createElement('video')
    parent.appendChild(videoElement)
    console.log(parent)
    const sourceElement = document.createElement('source')
    videoElement.setAttribute('src', source)
    videoElement.insertBefore(sourceElement, videoElement.children[0])
    videoElement.load()
    videoElement.play()
    console.log(this.config)
  }

  stop() {
    console.log(this.config)
  }

  resize() {
    console.log(this.config)
  }
}

module.exports = Player
