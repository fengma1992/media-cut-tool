<template>
    <div class="crop-container">
        <div class="crop-slider">
            <div ref="timeLineContainer" class="crop-time-line-container">
                <div class="crop-time-line"></div>
                    <div v-for="(item, index) in cropItemList"
                         :class="getCropRangeClass(index)"
                         :style="computedRangeStyle(item)"
                         :key="index">
                        <div :class="getTimeHintClass(index)">
                            <div class="cursor-line"></div>
                            <div class="cursor-time">{{getFormatTime(item.startTime)}}</div>
                        </div>
                        <div :class="getTimeHintClass(index)"
                             :style="computedEndTimeIndicatorStyle(item)">
                            <div class="cursor-line"></div>
                            <div class="cursor-time">{{getFormatTime(item.endTime)}}</div>
                        </div>
                    </div>
                
                <div :class="['cursor-time-hint', {'moving-cursor': showNormalCursorTimeHint}]"
                     :style="`transform: translateX(${currentCursorOffsetX}px)`">
                    <div class="cursor-line"></div>
                    <div class="cursor-time">{{getFormatTime(currentCursorTime)}}</div>
                </div>
            </div>
            <div class="media-duration">{{durationText}}</div>
        </div>
        <div class="crop-panel">
            <div class="crop-time-area">
                <div v-if="listLength > 1" class="crop-time-header">
                    <div class="text">{{language.CROP_CLIP_LIST}}</div>
                    <button class="small-btn" @click="reset()">
                        清空
                    </button>
                    <button class="small-btn" @click="toggleShowList()">
                        {{showList ? '收起' : '展开'}}
                    </button>
                </div>
                <div :class="['crop-time-body', {'crop-time-body-hide': !showList}]"
                     :data-count="!showList ? 0 :(listLength > 10 ? 10 : listLength -1)">
                    <template v-for="(item, index) in renderList">
                        <div v-if="index < listLength -1"
                             :key="index"
                             :data-highlight="cropItemHoverIndex === getOriginalIndex(index) ? 1 : 0"
                             class="crop-time-item">
                            <div class="time-area">
                                <div class="time-input-area">
                                    <span class="time-text">{{language.CUT_BEGIN_TIME}}:</span>
                                    <div class="time-input">
                                        <input type="text"
                                               :value="item.startTimeArr[0]"
                                               @input="startTimeChange($event, getOriginalIndex(index), 0)"/>
                                        :
                                        <input type="text"
                                               :value="item.startTimeArr[1]"
                                               @input="startTimeChange($event, getOriginalIndex(index), 1)"/>
                                        :
                                        <input type="text"
                                               :value="item.startTimeArr[2]"
                                               @input="startTimeChange($event, getOriginalIndex(index), 2)"/>
                                    </div>
                                </div>
                                <span class="range-text"> ~ </span>
                                <div class="time-input-area">
                                    <span class="time-text">{{language.CUT_END_TIME}}:</span>
                                    
                                    <div class="time-input">
                                        <input type="text"
                                               :value="item.endTimeArr[0]"
                                               @input="endTimeChange($event, getOriginalIndex(index), 0)"/>
                                        :
                                        <input type="text"
                                               :value="item.endTimeArr[1]"
                                               @input="endTimeChange($event, getOriginalIndex(index), 1)"/>
                                        :
                                        <input type="text"
                                               :value="item.endTimeArr[2]"
                                               @input="endTimeChange($event, index, 2)"/>
                                    </div>
                                </div>
                            </div>
                            <button class="small-btn" @click="togglePlayClip(getOriginalIndex(index))">
                                {{playingIndex === getOriginalIndex(index) ? '暂停' : '播放'}}
                            </button>
                            <button class="small-btn" @click="removeCropItem(getOriginalIndex(index))">
                                删除
                            </button>
                        </div>
                    </template>
                </div>
            </div>
            <!--固定的裁剪第一项在底栏-->
            <div class="crop-time-item" :data-highlight="cropItemHoverIndex === 0 ? 1 : 0"
                 :data-index="cropItemHoverIndex">
                <div class="time-area">
                    <div class="time-input-area">
                        <span class="time-text">{{language.CUT_BEGIN_TIME}}:</span>
                        <div class="time-input">
                            <input type="text"
                                   :value="renderList[listLength -1]
                                    && renderList[listLength -1].startTimeArr[0]"
                                   @input="startTimeChange($event, 0, 0)"
                                   @focus="inputFocus()"/>
                            :
                            <input type="text"
                                   :value="renderList[listLength -1]
                                    && renderList[listLength -1].startTimeArr[1]"
                                   @input="startTimeChange($event, 0, 1)"
                                   @focus="inputFocus()"/>
                            :
                            <input type="text"
                                   :value="renderList[listLength -1]
                                    && renderList[listLength -1].startTimeArr[2]"
                                   @input="startTimeChange($event, 0, 2)"
                                   @focus="inputFocus()"/>
                        </div>
                    </div>
                    <span class="range-text"> ~ </span>
                    <div class="time-input-area">
                        <span class="time-text">{{language.CUT_END_TIME}}:</span>
                        <div class="time-input">
                            <input type="text"
                                   :value="renderList[listLength -1]
                                    && renderList[listLength -1].endTimeArr[0]"
                                   @input="endTimeChange($event, 0, 0)"
                                   @focus="inputFocus()"/>
                            :
                            <input type="text"
                                   :value="renderList[listLength -1]
                                    && renderList[listLength -1].endTimeArr[1]"
                                   @input="endTimeChange($event, 0, 1)"
                                   @focus="inputFocus()"/>
                            :
                            <input type="text"
                                   :value="renderList[listLength -1]
                                    && renderList[listLength -1].endTimeArr[2]"
                                   @input="endTimeChange($event, 0, 2)"
                                   @focus="inputFocus()"/>
                        </div>
                    </div>
                </div>
                
                <button class="small-btn" @click="togglePlayClip(0)">
                    {{playing && playingIndex === 0 ? '暂停' : '播放'}}
                </button>
                <button class="small-btn" @click="addCropItem()">
                    添加
                </button>
            </div>
            <div :class="['confirm-btn', {'confirm-btn-disabled': isSendingCrop}]"
                 @click="confirmCrop()">{{isSendingCrop ? language.SENDING_DATA :language.CONFIRM_CUT_VIDEO}}
            </div>
        </div>
    </div>
</template>

<script>
    import formatTime from '../utils/formatTime'
    import simplifySecond from '../utils/simplifySecond'
    import throttle from '../utils/throttle'

    // 容器距页面左侧距离，用于测量鼠标event中的x距离
    let containerLeft = 0
    // 容器宽度
    let containerWidth = 0

    /**
     * 检测鼠标是否接近
     * @param x1
     * @param x2
     */
    const isCursorClose = function (x1, x2) {
        return Math.abs(x1 - x2) < 2
    }

    export default {
        name: 'crop-tool',
        components: {},
        props: {
            duration: {
                type: Number,
                default: 0
            },
            currentPlayingTime: {
                type: Number,
                default: 0
            },
            playing: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                cropItemHoverIndex: -1,
                timeLineContainer: undefined,
                sliderLength: 0,

                timeToPixelRatio: 1,
                cropItemList: [
                    // {
                    //     startTime: 0,
                    //     endTime: 100,
                    //     startTimeArr: [hours, minutes, seconds],
                    //     endTimeArr: [hours, minutes, seconds],
                    //     startTimeIndicatorOffsetX: 0,
                    //     endTimeIndicatorOffsetX: 100,
                    // }
                ],
                startTimeIndicatorHoverIndex: -1,
                endTimeIndicatorHoverIndex: -1,
                startTimeIndicatorDraggingIndex: -1,
                endTimeIndicatorDraggingIndex: -1,
                currentEditingIndex: 0,
                currentCursorTime: 0,
                currentCursorOffsetX: 0,
                isCursorIn: false,
                isCropping: false,

                language: {
                    CROP_CLIP_LIST: '裁剪列表',
                    CUT_BEGIN_TIME: '开始时间',
                    CUT_END_TIME: '结束时间',
                    SENDING_DATA: '裁剪中',
                    CONFIRM_CUT_VIDEO: '裁剪'
                },
                playingIndex: -1,
                showList: false,
                playingItem: undefined,
                isSendingCrop: false,
                infoLog: {
                    hasIllegalInputShowed: false,
                    hasStartTimeInputErrorShowed: false,
                    hasEndTimeInputError1Showed: false,
                    hasEndTimeInputError2Showed: false,
                },
            }
        },

        computed: {
            listLength () {
                return this.cropItemList.length
            },
            durationText () {
                return this.getFormatTime(this.duration)
            },

            showNormalCursorTimeHint () {
                return this.isCursorIn
                    && !this.isCropping
                    && !~this.startTimeIndicatorHoverIndex
                    && !~this.endTimeIndicatorHoverIndex
            },

            /**
             * 将itemList进行reverse，HTML好看
             * @return {*}
             */
            renderList: function () {
                const cropItemList = this.cropItemList.slice(0)
                return cropItemList.reverse()
            },
        },

        watch: {
            timeToPixelRatio () {
                this.forceUpdateCropDataList()
            },

            /**
             * 监测播放进度，达到片段末尾就暂停
             */
            currentPlayingTime (currentTime) {
                const playingItem = this.playingItem
                if (!playingItem) {
                    return
                }
                if (currentTime >= playingItem.endTime) {
                    this.pause()
                }
            },

            isCropping (isCropping) {
                if (isCropping) {
                    this.playingItem = null
                    this.playingIndex = -1
                }
            },

            duration () {
                // 时长更新后需更新界面
                this.calculateTimeLineData()
            },
        },

        mounted () {
            // 获取容器距页面左侧距离，用于后续鼠标event的x位置计算
            this.timeLineContainer = this.$refs.timeLineContainer

            this.$nextTick(() => {

                this.calculateTimeLineData()

                this.addListeners()
            })
        },

        methods: {


            getCropRangeClass (index) {
                let className = 'crop-range'

                if (this.cropItemHoverIndex === index) {
                    className += ' crop-range-hover'

                    if (this.isCropping) {
                        className += ' crop-range-dragging'
                    }
                }

                return className
            },

            getTimeHintClass (index) {
                let className = 'cursor-time-hint'

                if (this.isTimeIndicatorHovered(index)) {
                    className += ' crop-moving-cursor'
                }
                else {
                    className += this.currentEditingIndex === index ? ' cropping' : ''
                }

                return className
            },

            /**
             * 根据renderList的index获得cropItemList的index
             */
            getOriginalIndex (reversedIndex) {
                return this.listLength - 1 - reversedIndex
            },

            /**
             * 界面重新布局后需重新计算offsetX数据
             */
            forceUpdateCropDataList () {
                if (!this.listLength) {
                    return
                }

                const cropItemList = this.cropItemList
                const duration = this.duration
                const timeToPixelRatio = this.timeToPixelRatio
                cropItemList.forEach(item => {
                    let startTime = item.startTime
                    let endTime = item.endTime
                    if (!startTime || startTime < 0 || startTime >= duration) {
                        startTime = 0
                    }
                    if (!endTime || endTime < startTime || endTime > duration) {
                        endTime = duration
                    }
                    item.startTimeIndicatorOffsetX = startTime / timeToPixelRatio
                    item.endTimeIndicatorOffsetX = endTime / timeToPixelRatio
                })
                this.cropItemList = cropItemList.slice(0)
            },

            calculateTimeLineData () {
                if (!this.timeLineContainer) {
                    return
                }
                const duration = this.duration

                const rect = this.timeLineContainer.getBoundingClientRect()
                containerLeft = rect.left
                containerWidth = Math.floor(rect.width)

                this.sliderLength = containerWidth
                this.timeToPixelRatio = duration / containerWidth
            },

            getFormatTime (time) {
                const times = simplifySecond(time < 0 ? 0 : time)

                return [
                    times.hours,
                    times.minutes,
                    times.seconds
                ].join(':')
            },

            isTimeIndicatorHovered (index) {
                return this.startTimeIndicatorDraggingIndex === index
                    || this.startTimeIndicatorHoverIndex === index
                    || this.endTimeIndicatorDraggingIndex === index
                    || this.endTimeIndicatorHoverIndex === index
            },

            computedRangeStyle (item) {
                return 'transform: translateX('
                    + item.startTimeIndicatorOffsetX
                    + 'px); width:'
                    + (item.endTimeIndicatorOffsetX - item.startTimeIndicatorOffsetX)
                    + 'px'
            },

            computedEndTimeIndicatorStyle (item) {
                return 'transform: translateX('
                    + (item.endTimeIndicatorOffsetX - item.startTimeIndicatorOffsetX)
                    + 'px)'
            },

            getFormattedCropItem (startTime, endTime) {
                const duration = this.duration
                const timeToPixelRatio = this.timeToPixelRatio
                if (!startTime || startTime < 0 || startTime > duration) {
                    startTime = 0
                }
                if (endTime === undefined || endTime < startTime || endTime > duration) {
                    endTime = duration
                }

                return {
                    startTime: startTime,
                    endTime: endTime,
                    startTimeArr: formatTime.getFormatTimeArr(startTime),
                    endTimeArr: formatTime.getFormatTimeArr(endTime),
                    startTimeIndicatorOffsetX: startTime / timeToPixelRatio,
                    endTimeIndicatorOffsetX: endTime / timeToPixelRatio,
                }
            },

            /**
             * 鼠标点击抬起后开始裁剪
             * @param editingIndex {number} 当前裁剪item位置
             */
            startCropping (editingIndex) {
                // 开始裁剪后默认控制结束时标
                this.endTimeIndicatorDraggingIndex = editingIndex
                this.currentEditingIndex = editingIndex
                this.cropItemHoverIndex = editingIndex
                this.isCropping = true

                // 添加一项后列表项肯定存在了
                this.showList = true
            },

            stopCropping () {
                this.startTimeIndicatorDraggingIndex = -1
                this.endTimeIndicatorDraggingIndex = -1
                this.currentEditingIndex = -1
                this.cropItemHoverIndex = -1
                this.isCropping = false
            },

            /**
             * 点击时间条新增裁剪
             * @param currentCursorOffsetX
             */
            addNewCropItemInSlider () {
                const currentCursorTime = this.currentCursorTime
                const newCropItem = this.getFormattedCropItem(currentCursorTime, currentCursorTime)
                this.cropItemList.push(newCropItem)
            },

            /**
             * 将offsetX限定到时间条内
             */
            getFormattedOffsetX (offsetX) {
                if (offsetX < 0) {
                    return 0
                }
                if (offsetX >= containerWidth) {
                    return containerWidth
                }
                return offsetX
            },

            timeIndicatorCheck (currentCursorOffsetX, mouseEvent) {
                // 在裁剪状态，直接返回
                if (this.isCropping) {
                    return
                }

                // 鼠标移动，重设hover状态
                this.startTimeIndicatorHoverIndex = -1
                this.endTimeIndicatorHoverIndex = -1
                this.startTimeIndicatorDraggingIndex = -1
                this.endTimeIndicatorDraggingIndex = -1
                this.cropItemHoverIndex = -1

                this.cropItemList.forEach((item, index) => {
                    if (currentCursorOffsetX >= item.startTimeIndicatorOffsetX
                        && currentCursorOffsetX <= item.endTimeIndicatorOffsetX) {
                        this.cropItemHoverIndex = index
                    }

                    // 默认始末时间戳在一起时优先选中截止时间戳
                    if (isCursorClose(item.endTimeIndicatorOffsetX, currentCursorOffsetX)) {
                        this.endTimeIndicatorHoverIndex = index
                        // 鼠标放下，开始裁剪
                        if (mouseEvent === 'mousedown') {
                            this.endTimeIndicatorDraggingIndex = index
                            this.currentEditingIndex = index
                            this.isCropping = true
                        }
                    }

                    else if (isCursorClose(item.startTimeIndicatorOffsetX, currentCursorOffsetX)) {
                        this.startTimeIndicatorHoverIndex = index
                        // 鼠标放下，开始裁剪
                        if (mouseEvent === 'mousedown') {
                            this.startTimeIndicatorDraggingIndex = index
                            this.currentEditingIndex = index
                            this.isCropping = true
                        }
                    }
                })
            },

            timeIndicatorMove (currentCursorOffsetX) {
                // 裁剪状态，随动时间戳
                if (this.isCropping) {
                    const currentEditingIndex = this.currentEditingIndex
                    const startTimeIndicatorDraggingIndex = this.startTimeIndicatorDraggingIndex
                    const endTimeIndicatorDraggingIndex = this.endTimeIndicatorDraggingIndex
                    const currentCursorTime = this.currentCursorTime

                    let currentItem = this.cropItemList[currentEditingIndex]
                    // 操作起始位时间戳
                    if (startTimeIndicatorDraggingIndex > -1 && currentItem) {
                        // 已到截止位时间戳则直接返回
                        if (currentCursorOffsetX > currentItem.endTimeIndicatorOffsetX) {
                            return
                        }
                        currentItem.startTimeIndicatorOffsetX = currentCursorOffsetX
                        currentItem.startTime = currentCursorTime
                    }

                    // 操作截止位时间戳
                    if (endTimeIndicatorDraggingIndex > -1 && currentItem) {
                        // 已到起始位时间戳则直接返回
                        if (currentCursorOffsetX < currentItem.startTimeIndicatorOffsetX) {
                            return
                        }
                        currentItem.endTimeIndicatorOffsetX = currentCursorOffsetX
                        currentItem.endTime = currentCursorTime
                    }
                    this.updateCropItem(currentItem, currentEditingIndex)
                }
            },
            addListeners () {
                window.addEventListener('resize', this.calculateTimeLineData.bind(this))

                if (!this.timeLineContainer) {
                    return
                }
                let lastMouseDownOffsetX = null
                this.timeLineContainer.addEventListener('mousemove', e => {
                    throttle(() => {
                        const currentCursorOffsetX = e.clientX - containerLeft

                        // mousemove范围检测
                        if (currentCursorOffsetX < 0 || currentCursorOffsetX > containerWidth) {
                            this.isCursorIn = false
                            // 鼠标拖拽状态到达边界直接触发mouseup状态
                            if (this.isCropping) {
                                this.stopCropping()
                                this.timeIndicatorCheck(currentCursorOffsetX < 0 ? 0 : containerWidth, 'mouseup')
                            }
                            return
                        }
                        else {
                            this.isCursorIn = true
                        }

                        this.currentCursorTime = currentCursorOffsetX * this.timeToPixelRatio
                        this.currentCursorOffsetX = currentCursorOffsetX

                        this.timeIndicatorCheck(currentCursorOffsetX, 'mousemove')
                        this.timeIndicatorMove(currentCursorOffsetX)

                    }, 10, true)()

                })
                this.timeLineContainer.addEventListener('mousedown', e => {
                    const currentCursorOffsetX = e.clientX - containerLeft
                    lastMouseDownOffsetX = currentCursorOffsetX
                    this.timeIndicatorCheck(currentCursorOffsetX, 'mousedown')
                })
                this.timeLineContainer.addEventListener('mouseup', e => {

                    // 已经处于裁剪状态时，鼠标抬起，则裁剪状态取消
                    if (this.isCropping) {
                        this.stopCropping()
                        return
                    }

                    const currentCursorOffsetX = this.getFormattedOffsetX(e.clientX - containerLeft)
                    // mousedown与mouseup位置不一致，则不认为是点击,直接返回
                    if (Math.abs(currentCursorOffsetX - lastMouseDownOffsetX) > 3) {
                        return
                    }

                    // 更新当前鼠标指向的时间
                    this.currentCursorTime = currentCursorOffsetX * this.timeToPixelRatio

                    // 鼠标点击新增裁剪片段
                    if (!this.isCropping) {
                        this.addNewCropItemInSlider()

                        // 新操作位置为数组最后一位
                        this.startCropping(this.cropItemList.length - 1)
                    }
                })
            },


            /**
             * 用户点击第一条时间输入框时无数据则预增加一条数据
             */
            inputFocus () {
                if (!this.listLength) {
                    this.addCropItem()
                }
            },

            startTimeChange (event, cropItemListIndex, timeArrIndex) {
                const value = Math.floor(+event.target.value)
                const cropItemList = this.cropItemList.slice(0)
                const currentItem = cropItemList[cropItemListIndex]
                // 判断输入值超出范围或NaN,恢复原值
                if (value < 0 || value > 59 || value !== value) {
                    console.log('不合法的输入值')
                }
                else {
                    // 输出用户自定义值
                    currentItem.startTimeArr[timeArrIndex] = String(value).padStart(2, '0')
                    currentItem.startTime = formatTime.restoreTimeFromTimeArr(currentItem.startTimeArr)
                    // 开始时间不能大于结束时间
                    if (currentItem.startTime > currentItem.endTime) {
                        currentItem.startTime = currentItem.endTime - 1
                        currentItem.startTimeArr = formatTime.getFormatTimeArr(currentItem.startTime)

                        console.log('起始值必须小于结束值')
                    }

                    this.updateCropItem(currentItem, cropItemListIndex)
                }
                event.target.value = currentItem.startTimeArr[timeArrIndex]
            },

            endTimeChange (event, cropItemListIndex, timeArrIndex) {
                const value = Math.floor(+event.target.value)
                const cropItemList = this.cropItemList.slice(0)
                const currentItem = cropItemList[cropItemListIndex]
                // 判断输入值超出范围或NaN,恢复原值
                if (value < 0 || value > 59 || value !== value) {
                    console.log('不合法的输入值')
                }
                else {
                    // 输出用户自定义值
                    currentItem.endTimeArr[timeArrIndex] = String(value).padStart(2, '0')
                    currentItem.endTime = formatTime.restoreTimeFromTimeArr(currentItem.endTimeArr)
                    // 结束时间不能小于开始时间
                    if (currentItem.endTime < currentItem.startTime) {
                        currentItem.endTime = +currentItem.startTime + 1
                        currentItem.endTimeArr = formatTime.getFormatTimeArr(currentItem.endTime)

                        console.log('结束值必须大于起始值')
                    }
                    // 结束时间不能大于总时长
                    const duration = this.duration
                    if (currentItem.endTime > duration) {

                        console.log('结束值不能大于总时长')

                        currentItem.endTime = duration
                        currentItem.endTimeArr = formatTime.getFormatTimeArr(duration)
                    }

                    this.updateCropItem(currentItem, cropItemListIndex)
                }
                event.target.value = currentItem.endTimeArr[timeArrIndex]
            },
            /**
             * 切换列表展示
             */
            toggleShowList () {
                this.showList = !this.showList
            },


            /**
             * 更新全部裁剪
             */
            updateAllCropItems (cropItemList) {
                this.cropItemList = cropItemList
                this.forceUpdateCropDataList()
            },

            /**
             * 更新单个裁剪
             */
            updateCropItem (item, index) {
                const newItem = this.getFormattedCropItem(item.startTime, item.endTime)
                this.cropItemList.splice(index, 1, newItem)
            },

            /**
             * 移除单个裁剪
             * @param index
             */
            removeCropItem (index) {
                this.cropItemList.splice(index, 1)
            },

            /**
             * 添加一个空裁剪
             */
            addCropItem () {
                this.showList = true
                // 默认添加的时间为1/4到 3/4，到边缘时用户鼠标不好选中时间条
                const quarterTime = this.duration / 4
                const newItem = this.getFormattedCropItem(quarterTime, quarterTime * 3)
                this.cropItemList.push(newItem)
            },

            /**
             * 重置
             */
            reset () {
                this.cropItemList = []
                this.cropItemHoverIndex = -1
                this.startTimeIndicatorHoverIndex = -1
                this.endTimeIndicatorHoverIndex = -1
                this.startTimeIndicatorDraggingIndex = -1
                this.endTimeIndicatorDraggingIndex = -1
                this.currentEditingIndex = 0
                this.currentCursorTime = 0
                this.currentCursorOffsetX = 0
                this.isCursorIn = false
                this.isCropping = false
                this.showList = false
                this.playingItem = undefined
                this.playingIndex = -1
                this.isSendingCrop = false
                this.$emit('stop')
            },

            /**
             * 切换片段播放暂停
             * @param index
             */
            togglePlayClip (index) {
                if (this.playingItem) {
                    this.pause()
                }
                else {
                    this.playSelectedClip(index)
                }
            },

            /**
             * 播放选中片段
             * @param index
             */
            playSelectedClip (index) {
                if (!this.listLength) {
                    console.log('无裁剪片段')
                    return
                }
                this.playingItem = this.cropItemList[index]
                this.playingIndex = index
                if (!this.playingItem) {
                    return
                }
                this.isCropping = false

                const startTime = this.playingItem.startTime

                this.$emit('play', startTime || 0)
            },

            pause () {
                this.$emit('pause')
            },

            /**
             * cropItemList排序并去重
             */
            cleanCropItemList () {
                let cropItemList = this.cropItemList

                // 1. 依据startTime由小到大排序
                cropItemList = cropItemList.sort(function (item1, item2) {
                    return item1.startTime - item2.startTime
                })

                let tempCropItemList = []
                let startTime = cropItemList[0].startTime
                let endTime = cropItemList[0].endTime


                // 遍历，删除重复片段
                cropItemList.forEach(item => {

                    // currentItem片段包含item
                    if (item.endTime <= endTime && item.startTime >= startTime) {
                        return
                    }
                    // currentItem片段与item有重叠
                    if (item.startTime <= endTime && item.endTime >= endTime) {
                        endTime = item.endTime
                        return
                    }
                    // currentItem片段与item无重叠,向列表添加一项，更新记录参数
                    if (item.startTime > endTime) {
                        tempCropItemList.push({
                            startTime: startTime,
                            endTime: endTime,
                            startTimeArr: formatTime.getFormatTimeArr(startTime),
                            endTimeArr: formatTime.getFormatTimeArr(endTime),
                        })

                        startTime = item.startTime
                        endTime = item.endTime
                    }
                })

                // 遍历完成，将最后的时间片段写入列表
                tempCropItemList.push({
                    startTime: startTime,
                    endTime: endTime,
                    startTimeArr: formatTime.getFormatTimeArr(startTime),
                    endTimeArr: formatTime.getFormatTimeArr(endTime),
                })

                return tempCropItemList
            },

            /**
             * 确认裁剪
             */
            confirmCrop () {

                if (this.isSendingCrop) {
                    console.log('裁剪中')
                    return
                }

                if (!this.listLength) {
                    console.log('无裁剪片段')
                    return
                }

                let cropItemList = this.cropItemList

                this.isSendingCrop = true

                const tempCropItemList = this.cleanCropItemList()


                // 更新全部裁剪片段
                if (JSON.stringify(tempCropItemList) !== JSON.stringify(cropItemList)) {
                    console.log('存在重复裁剪，已自动为您优化')
                    this.updateAllCropItems(tempCropItemList)
                }

                this.isSendingCrop = false
                // 输出裁剪片段
                return tempCropItemList
            }
        },
    }
</script>
