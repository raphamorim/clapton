class Player {
  constructor(config) {
    this.config = config
    this._options = config
  }

  escapeHandler(ev) {
    if (e.keyCode === 27)
      console.log(11)

  }

  play() {
    const { parent, source } = this.config
    const iframe = document.createElement('iframe')
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.src = source

    if (iframe.addEventListener)
      iframe.addEventListener('keydown', this.escapeHandler, true)

    parent.appendChild(iframe)
  }

  pause() {
    console.log(this.config)
  }

  resize() {
    console.log(this.config)
  }
}

module.exports = Player
