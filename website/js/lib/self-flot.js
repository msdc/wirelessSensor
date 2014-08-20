; (function ($) {
    $.selfflot = function (options) {
        $.extend(this, {
            defaults: {
                insertElement: $("body"),
                jsonData: "",
                legendContainer:$("#placelegend")
            },
            flotOptions: {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                legend: {
                    noColumns: 3,
                    labelFormatter: function (label, series) {
                        return label + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    },
                    labelBoxBorderColor: "#fff"
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%Y-%m-%d",
                    timezone: "browser",
                    ticks: 7,
                    tickFormatter: function (val, axis) {
                        var date = new Date(val);
                        return date.format("yyyy-MM-dd");
                    },
                    labelWidth: 80
                },
                yaxis: {
                    min: 0
                },
                colors: ["#26A9E5", "#DB552F", "#FABC41"],
                grid: {
                    borderWidth: 1,
                    borderColor: "#ccc",
                    hoverable: true,
                    clickable: true
                }
            },
            init: function (settings) {
                this.defaults = $.extend(true, {}, this.defaults, settings);
                this.initFlot();
            },
            initFlot: function () {
                var flot = this;

                $("<div id='tooltip'></div>").css({
                    position: "absolute",
                    display: "none",
                    border: "1px solid #fdd",
                    padding: "2px",
                    "background-color": "#fee",
                    opacity: 0.80
                }).appendTo("body");

                this.defaults.insertElement.bind("plothover", function (event, pos, item) {
                    flot.showToolTip(item);
                });

                this.defaults.insertElement.bind("plotclick", function (event, pos, item) {
                    flot.showToolTip(item);
                });

                this.restart(this.defaults.jsonData);
            },
            restart: function (json) {
                var datas = this.parseDataToFlot(json);
                this.loadFlot(datas);
            },
            loadFlot: function (datas) {
                if (datas != null && datas != undefined) {
                    this.flotOptions = $.extend(true, {}, this.flotOptions, { xaxis: { ticks: datas[0].data.length }, legend: { container: this.defaults.legendContainer } });
                    $.plot(this.defaults.insertElement, datas, this.flotOptions);
                }
            },
            showToolTip: function (item) {
                if (item) {
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                    var date = new Date(parseInt(x));

                    $("#tooltip").html(item.series.label + ":　" + parseInt(y) + "<br/>日期：" + date.format("yyyy-MM-dd"))
                        .css({ top: item.pageY + 5, left: item.pageX + 5 })
                        .fadeIn(200);
                } else {
                    $("#tooltip").hide();
                }
            },
            parseDataToFlot: function (json) {
                var jsonObj = JSON.parse(json);

                var minDate = new Date(9999, 0, 0), maxData = new Date(1970, 0, 0);
                for (var i = 0; i < jsonObj.length; i++) {
                    for (var j = 0; j < jsonObj[i].data.length; j++) {
                        var currentDate = this.formatDate(jsonObj[i].data[j].x);

                        if (this.compareDate(minDate, currentDate) >= 0) {
                            minDate = currentDate;
                        }
                        if (this.compareDate(maxData, currentDate) == -1) {
                            maxData = currentDate;
                        }
                    }
                }

                var xlength = minDate.dateDiff("d", maxData);

                var datas = [];
                for (var i = 0; i < jsonObj.length; i++) {
                    var data = [], mustDate = new Date(minDate);
                    for (var j = 0; j <= xlength; j++) {
                        var isAdd = false;
                        for (var k = 0; k < jsonObj[i].data.length; k++) {
                            var currentData = jsonObj[i].data[k];
                            var currentDate = this.formatDate(currentData.x);
                            if (this.compareDate(mustDate, currentDate) == 0) {
                                data.push([currentDate, currentData.y]);
                                isAdd = true;
                                break;
                            }
                        }
                        if (!isAdd) {
                            data.push([new Date(mustDate), 0]);
                        }
                        mustDate.setDate(mustDate.getDate() + 1);
                    }
                    datas.push({ label: jsonObj[i].label, data: data });
                }
                return datas;
            },
            compareDate: function (dateOne, dateTwo) {
                if (Date.parse(dateOne) - Date.parse(dateTwo) == 0) {
                    return 0;
                }
                else if (Date.parse(dateOne) - Date.parse(dateTwo) < 0) {
                    return -1
                }
                else if (Date.parse(dateOne) - Date.parse(dateTwo) > 0) {
                    return 1;
                }
                return false;
            },
            formatDate: function (date) {
                if (date != undefined && date != null) {
                    var darg = date.split("-");
                    if (new Date(date)) {
                        return new Date(darg[0], parseInt(darg[1]) - 1, parseInt(darg[2]));
                    }
                }
                return null;
            }
        });

        this.options = $.extend(true, {}, options);
        this.init(options);
    };
})(jQuery);