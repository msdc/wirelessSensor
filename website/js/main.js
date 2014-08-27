$(document).ready(function () {
    if (App.CurrentMenu != undefined) {
        if (App.CurrentMenu.indexOf("place") > 0) {
            $("#place").removeClass("hide");
        } else if (App.CurrentMenu.indexOf("business") > 0) {
            $("#business").removeClass("hide");
        } else if (App.CurrentMenu.indexOf("system") > 0) {
            $("#system").removeClass("hide");
        }
        $("#" + App.CurrentMenu).addClass("nav-active");
    }
});

jQuery.fn.extend({
    alert: function (type, message) {
        var alertOut = $('<div class="alert alert-dismissible " role="alert"></div>');
        var head = "";
        switch (type) {
            case "success": alertOut.addClass("alert-success"); head = "成功"; break;
            case "info": alertOut.addClass("alert-info"); head = "提示"; break;
            case "warning": alertOut.addClass("alert-warning"); head = "警告"; break;
            case "danger": alertOut.addClass("alert-danger"); head = "危险"; break;
        }
        alertOut.append('<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>')
            .append('<strong>' + head + '！</strong>')
            .append("&nbsp;&nbsp;" + message)
            .appendTo(this);
    }
});