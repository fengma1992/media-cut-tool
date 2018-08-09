/*
 * @file 格式化时间
 * @author fengma1992
 */
import simplifySecond from './simplifySecond'


/**
 * 将秒转换为HH:MM:SS格式字符串
 * @param time
 * @return {string}
 */
const getFormatTime = function (time) {
    const times = simplifySecond(time < 0 ? 0 : time)

    return [
        times.hours,
        times.minutes,
        times.seconds
    ].join(':')
}

/**
 * 将秒转换为[HH, MM, SS]格式数组
 * @param time
 * @return {array}
 */
const getFormatTimeArr = function (time) {
    const times = simplifySecond(time < 0 ? 0 : time)

    return [
        times.hours,
        times.minutes,
        times.seconds
    ]
}

/**
 * 将[HH, MM, SS]格式数组转换为秒
 * @param timeArr
 * @return {number}
 */
const restoreTimeFromTimeArr = function (timeArr) {
    const time = +timeArr[0] * 3600 + +timeArr[1] * 60 + +timeArr[2]
    return time > 0 ? time : 0
}

/**
 * 将HH:MM:SS格式字符串转换为秒
 * @param timeStr
 * @return {number}
 */
const restoreOriginalTime = function (timeStr) {
    const timeArr = timeStr.split(':')
    if (timeArr.length !== 3
        || timeArr[0].length !== 2
        || timeArr[1].length !== 2
        || timeArr[2].length !== 2) {
        return 0
    }
    const time = timeArr[0] * 3600 + timeArr[1] * 60 + timeArr[2]
    return time > 0 ? time : 0
}

export default {
    getFormatTime,
    getFormatTimeArr,
    restoreTimeFromTimeArr,
    restoreOriginalTime,
}