# media-cut-tool
一个Vue媒体多段裁剪工具

详细介绍：[https://juejin.im/post/5b6960d8e51d4519115d5d2f](https://juejin.im/post/5b6960d8e51d4519115d5d2f)


使用示例：
```html
<template>
    <div id="app">
        <video ref="video" src="https://pan.prprpr.me/?/dplayer/hikarunara.mp4" controls width="600px"></video>
        <CropTool :duration="duration"
                  :playing="playing"
                  :currentPlayingTime="currentTime"
                  @play="playVideo"
                  @pause="pauseVideo"
                  @stop="stopVideo"/>
    </div>
</template>

<script>
    import CropTool from './components/CropTool.vue'
    
    export default {
        name: 'app',
        components: {
            CropTool,
        },
        data () {
            return {
                duration: 0,
                playing: false,
                currentTime: 0
            }
        },
        mounted () {
            const videoElement = this.$refs.video
            videoElement.ondurationchange = () => {
                this.duration = videoElement.duration
            }
            videoElement.onplaying = () => {
                this.playing = true
            }
            videoElement.onpause = () => {
                this.playing = false
            }
            videoElement.ontimeupdate = () => {
                this.currentTime = videoElement.currentTime
            }
        },
        methods: {
            seekVideo (seekTime) {
                this.$refs.video.currentTime = seekTime
            },
            playVideo (time) {
                this.seekVideo(time)
                this.$refs.video.play()
            },
            pauseVideo () {
                this.$refs.video.pause()
            },
            stopVideo () {
                this.$refs.video.pause()
                this.$refs.video.currentTime = 0
            }
        },
    }
</script>

```
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
