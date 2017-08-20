class Player {
  constructor(config) {
    this.config = config
    this._source = null
    this._options = config
  }

  escapeHandler(ev) {
    if (e.keyCode === 27)
      console.log(11)
  }

  play() {
    const {
      parent,
      source
    } = this.config

    const videoElement = document.createElement('video')
    parent.appendChild(videoElement)
    console.log(parent)
    const sourceElement = document.createElement('source')
    videoElement.style.width="100%"
    videoElement.controls = true
    videoElement.setAttribute('src', source)
    videoElement.insertBefore(sourceElement, videoElement.children[0])
    this._source = videoElement
    videoElement.load()
    videoElement.play()
  }

  pause() {
    this._source.pause()
  }

  resize() {
    console.log(this.config)
  }
}

module.exports = Player
