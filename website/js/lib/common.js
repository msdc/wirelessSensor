/***************************
        公共方法
***************************/
//加载脚步
function includeJS(file, callback) {
    var _doc = document.getElementsByTagName('head')[0];
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', file);
    _doc.appendChild(js);
    if (document.all) { //如果是IE
        js.onreadystatechange = function () {
            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                if (callback != undefined && callback != null) {
                    callback();
                }
            }
        }
    }
    else {
        js.onload = function () {
            if (callback != undefined && callback != null) {
                callback();
            }
        }
    }
}

/***************************
        添加属性方法 
***************************/
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            return i;
        }
    }
    return -1;
}

Array.prototype.removeVal = function (val) {
    var index = this.indexOf(val);
    if (index != -1) {
        this.splice(index, 1);
    }
}

Array.prototype.clone = function () {
    return [].concat(this);
}

String.prototype.replaceAll = function (readllyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(readllyDo)) {
        return this.replace(new RegExp(readllyDo, ignoreCase ? "gi" : "g"), replaceWith);
    } else {
        return this.replace(readllyDo, replaceWith);
    }
}

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 0 && typeof (args) == "Object") {
            for (var key in arguments) {
                if (arguments[key] != undefined) {
                    result = result.replaceAll("\\{0\\}", arguments[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    result = result.replaceAll("\\{" + i + "\\}", arguments[i]);
                }
            }
        }
    }
    return result;
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}

Date.prototype.dateDiff = function (interval, endTime) {
    switch (interval) {
        //计算秒差
        case "s":
            return parseInt((endTime - this) / 1000);
            //计算分差
        case "n":
            return parseInt((endTime - this) / 60000);
            //计算時差
        case "h":
            return parseInt((endTime - this) / 3600000);
            //计算日差
        case "d":
            return parseInt((endTime - this) / 86400000);
            //计算周差
        case "w":
            return parseInt((endTime - this) / (86400000 * 7));
            //计算月差
        case "m":
            return (endTime.getMonth() + 1) + ((endTime.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
            //计算年差
        case "y":
            return endTime.getFullYear() - this.getFullYear();
            //输入有误
        default:
            return undefined;
    }
}

