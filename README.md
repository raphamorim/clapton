# Clapton

> Yet Another Open Source Media Player

![Example](assets/images/clapton.png)

## Features

- Is another Open Source Media Player (yey te-hehe)
- Hackable
- Support stream of Torrents
- Allows multiples Source (automatic playlist)
- Chromecast Integration ([issue #6](https://github.com/raphamorim/clapton/issues/6))
- Airplay Integration ([issue #2](https://github.com/raphamorim/clapton/issues/6))
- [Suggest a feature](https://github.com/raphamorim/clapton/issues/new)

## Hackable

Clapton can load local Clappr Plugins. You only need to specify a `~/.claptonconfig` on your `$HOME`

You can create runing:

```bash
$ touch $HOME/.claptonconfig
```
Sample:

```json
"defaults": {
  "theaterSource": "absolute-path-to-my-video",
  "colors": {
    "primaryColor": "blue",
    "secondColor": "red"
  }
},
"plugins": {
  "my-clappr-plugin": "absoulute-path-to-my-plugin"
}
```

Note: `.claptonconfig` is optional.

## Extending Clappr

[Generator-Clappr-Plugin](https://github.com/clappr/generator-clappr-plugin)

## External Plugins

|Plugin         |Status|Compatible with latest Clappr|URL|
|-----------------------|--------|-------------------------------|--------------------------------------------------------|
|Thumbnails on seekbar| Ready | Yes | https://github.com/tjenkinson/clappr-thumbnails-plugin |
|Markers       | Ready | Yes | https://github.com/tjenkinson/clappr-markers-plugin |
|Level Selector| Ready | Yes | https://github.com/clappr/clappr-level-selector-plugin |
|360 videos| Ready | Yes | https://github.com/thiagopnts/video-360 |
|Chromecast| Ready | Yes | https://github.com/clappr/clappr-chromecast-plugin |
|DASH with shaka| Ready | Yes | https://github.com/clappr/dash-shaka-playback |
|Playback Speed | Ready | Yes | https://github.com/bikegriffith/clappr-playback-rate-plugin |
|Clappr Stats | Ready | Yes | https://github.com/leandromoreira/clappr-stats |
|Pause while far| Ready | Yes | https://github.com/leandromoreira/clappr-pause-tab-visibility |
|RTMP           | Ready | Yes | https://github.com/clappr/clappr-rtmp-plugin |
|Picture-in-Picture | Ready | Yes | https://github.com/tjenkinson/clappr-pip-plugin |
|HLS+P2P        | Ready | [WIP](https://github.com/bemtv/clappr-p2phls-plugin/issues/148) | http://bem.tv |
|Comments on seekbar| Ready | ? | https://github.com/Metrakit/clappr-comment-plugin |
|Voice control| Ready | ? | https://github.com/flavioribeiro/clappr-speech-control-plugin |
|Dash           | WIP | No | https://github.com/shankardevy/clappr-dash-plugin | |
|Youtube        | Ready | No | https://github.com/towerz/clappr-youtube-playback |
|VAST Ad plugin | WIP | No | https://github.com/vix-simplex/clappr-ad-plugin |

## Supported Formats

Version       |HLS|MP4|MP3|WEBM| DASH | RTMP | JPG/PNG/GIF |
-------------|---|---|---|----|------|------|-------------|
 0.1.8 | ✔ | ✔ | ✔ |  ✔ | ![dash](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ✔

![rtmp](http://flv.io/external3.png) means that the support is made by an external plugin.

## Credits

Clapton was created by [@raphamundi](https://twitter.com/raphamundi).

Powered by [Electron](https://github.com/electron/electron), [Clappr](github.com/clappr/clappr) and [WebTorrent](https://github.com/webtorrent/webtorrent).

