class Player {
  constructor(config) {
    this.config = config
  }

  play() {
    const { parent, source } = this.config
    const iframe = document.createElement('iframe')
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.src = source

    // if(iframe.addEventListener)
    //   iframe.addEventListener('keydown', func, true)
    // else if(iframe.attachEvent)
    //   iframe.attachEvent('onKeyDown',func)

    parent.appendChild(iframe)
  }

  stop() {
    console.log(this.config)
  }

  resize() {
    console.log(this.config)
  }
}

module.exports = Player
