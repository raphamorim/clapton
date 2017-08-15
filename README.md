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
  "source": "absolute-path-to-my-video",
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

## Supported Formats

Version       |HLS|MP4|MP3|WEBM| DASH | RTMP | JPG/PNG/GIF |
-------------|---|---|---|----|------|------|-------------|
 0.1.8 | ✔ | ✔ | ✔ |  ✔ | ![dash](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ✔

![rtmp](http://flv.io/external3.png) means that the support is made by an external plugin.

## Credits

Clapton was created by [@raphamundi](https://twitter.com/raphamundi).

Powered by [Electron](https://github.com/electron/electron), [Clappr](github.com/clappr/clappr) and [WebTorrent](https://github.com/webtorrent/webtorrent).

