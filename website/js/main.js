$(document).ready(function () {
    //$('#navbar-menu [data-toggle="collapse"]').click(function () {
    //    var $menus = $('#navbar-menu [data-toggle="collapse"]');
    //    var $currentHref = this.attributes["href"].nodeValue;
    //    var $this = $(this);
    //    $menus.each(function (index) {
    //        var $elementHref = this.attributes["href"].nodeValue;
    //        if ($currentHref != $elementHref) {
    //            $($elementHref).removeClass("in").addClass("collapse");
    //        }
    //    });
    //});

    //$("ul[id^='menu-']").on('show.bs.collapse', function () {
    //    $(this).parent("li").find("span.glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");

    //    var _this = this;
    //    var menus = $("ul[id^='menu-']");
    //    menus.each(function (index) {
    //        if (this.id != _this.id) {
    //            $(this).parent("li").find("span.glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    //        }
    //    });

    //}).on('hide.bs.collapse', function () {
    //    $(this).parent("li").find("span.glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    //});

    //var $menus = $("ul[id^='menu-']");
    //$menus.each(function (index) {
    //    if ($(this).hasClass("in")) {
    //        $(this).parent("li").find("span.glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    //    }
    //});

    if (App.CurrentMenu != undefined)
    {
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