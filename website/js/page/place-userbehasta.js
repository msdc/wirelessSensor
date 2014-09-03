App.CurrentMenu = 'li-place-userbehasta';

/*******************
***     View    ***
*******************/

/*******************
***     Model    ***
*******************/


/*******************
***    Router    ***
*******************/
App.Router.map(function () {
    this.resource('container', { path: '/' });
});

/*******************
***   Control    ***
*******************/

/*******************
***  Initialize  ***
*******************/
App.initialize();

$(document).ready(function () {
    var startDate = $('#validate_startDate').datetimepicker({
        language: 'zh-CN',
        weekStart: 0,
        todayBtn: 0,
        autoclose: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        showMeridian: 1,
        format: "yyyy-mm-dd",
        startDate: new Date()
    }).on('changeDate', function (ev) {
        var newDate = new Date(ev.date)

        var end = endDate.datetimepicker('getDate');
        if (end == undefined || ev.date.valueOf() > end.valueOf()) {
            $('#validate_endDate').datetimepicker("setDate", newDate);
            $('#validate_endDate').datetimepicker("update");
        }

        $('#validate_endDate').datetimepicker("setStartDate", newDate);
        $('#validate_startDate').datetimepicker("hide");
        $('#validate_endDate').datetimepicker("show");
    });


    var endDate = $('#validate_endDate').datetimepicker({
        language: 'zh-CN',
        weekStart: 0,
        todayBtn: 0,
        autoclose: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        showMeridian: 1,
        format: "yyyy-mm-dd"
    }).on('changeDate', function (ev) {
        $('#validate_endDate').datetimepicker("hide");
    });
});