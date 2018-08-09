/**
 * @file 常用于倒计时、或播放器的进度时长之类的
 * @author fengma1992
 */
export default function (seconds) {

    const date = new Date(seconds * 1000);

    return {
        days: String(date.getUTCDate() - 1).padStart(2, '0'),
        hours: String(date.getUTCHours()).padStart(2, '0'),
        minutes: String(date.getUTCMinutes()).padStart(2, '0'),
        seconds: String(date.getUTCSeconds()).padStart(2, '0')
    };

}