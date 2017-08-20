class Player {
  constructor(config) {
    this.config = config
    this._sourceElement = null
    this._source = null
    this._options = config
  }

  play() {
    const {
      parent,
      source
    } = this.config

    let videoElement = document.querySelector('#clapton-fallback-player')

    if (!videoElement) {
      videoElement = document.createElement('video')
      videoElement.id = 'clapton-fallback-player'
      parent.appendChild(videoElement)
    }

    if (!(this._source === source)) {
      const sourceElement = document.createElement('source')
      videoElement.style.width="100%"
      videoElement.controls = true
      videoElement.setAttribute('src', source)
      videoElement.insertBefore(sourceElement, videoElement.children[0])
      this._sourceElement = videoElement
      videoElement.load()
    }

    this._source = source
    videoElement.play()
  }

  pause() {
    this._sourceElement.pause()
  }

  resize() {
    this._sourceElement.style.width="100%"
    this._sourceElement.style.height="100%"
  }
}

module.exports = Player
