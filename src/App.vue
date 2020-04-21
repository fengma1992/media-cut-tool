<template>
    <div id="app">
        <div class="input-container">
            <span>视频链接：</span>
            <input type="text" v-model="videoUrl"/>
        </div>
        <video ref="video" :src="videoUrl" controls width="600px"></video>
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
                videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
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
