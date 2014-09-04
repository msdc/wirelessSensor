
App.CurrentMenu = 'li-business-promotion';

/*******************
***     View    ***
*******************/
App.ActivityView = Ember.View.extend({
    templateName: 'activity',
    contentBinding: 'App.ActivityController',
    onRerender: function () {
        this.rerender();
    }.observes('content.sellers')
});

App.ModalView = Ember.View.extend({
    templateName: 'modal',
    contentBinding: 'App.ModalController',
    categorySelectView: Ember.Select.extend({
        contentBinding: 'App.CategoryController',
        optionValuePath: 'content.id',
        optionLabelPath: 'content.name'
    })
});

/*******************
***     Model    ***
*******************/
App.ActivityModel = Em.Object.extend({
    id: null,
    seller:null,
    name: null,
    category: null,
    status: null,
    tag: null,
    startDate:null,
    endDate:null,
    desc: null,
    images: []
});

App.CategoryModel = Em.Object.extend({
    id: null,
    name: null
});


/*******************
***    Router    ***
*******************/
App.Router.map(function () {
    this.resource('container', { path: '/' });
});

/*******************
***   Control    ***
*******************/
App.ActivityController = Ember.ArrayController.create({
    content: [],
    removeItem: null,
    insert: function () {
        var activities = this.get("content");
        activities.sort(function (x, y) {
            if (x.id > y.id)
                return -1;
            if (x.id < y.id)
                return 1;
        })
        var id = 1;
        if (activities.length > 0) {
            id = activities[0].id + 1;
        }
        App.ModalController.create("insert", { id: id});
    },
    update: function (id) {
        var activities = this.get("content");
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].id == id) {
                App.ModalController.create("update", activities[i]);
                break;
            }
        }
    },
    sure: function (item) {
        $('#modalDelete').modal('show')
        this.set("removeItem", item);
    },
    remove: function () {
        $('#modalDelete').modal('hide')
        var _this = this;
        var item = this.get("removeItem");
        api.ms.deletepromotion(item, function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "删除促销活动失败！  " + arguments[1].message);
            } else {
                $("#divAlert").alert("success", "删除促销活动成功！  ");
                _this.get('content').removeObject(item);
            }
        });
    },
    removeAll: function () {
        var maps = this.get('content');
        var arg = (maps || []).copy();
        for (var i = 0; i < arg.length; i++) {
            this.get('content').removeObject(arg[i]);
        }
    },
    create: function (activities) {
        this.removeAll();
        for (var i = 0; i < activities.length; i++) {
            this.get('content').pushObject(App.ActivityModel.create({
                id: activities[i].id,
                seller:activities[i].seller,
                name: activities[i].name,
                category: activities[i].category,
                status: activities[i].status,
                startDate: activities[i].startDate,
                endDate: activities[i].endDate,
                tag: activities[i].tag,
                desc: activities[i].desc,
                images: activities[i].images               
            }));
        }
    }
});

App.ModalController = Ember.ObjectController.create({
    title: null,
    id: null,
    seller:null,
    name: null,
    category: null,
    status: null,
    tag: null,
    startDate:null,
    endDate:null,
    desc: null,
    images: [],
    act: null,
    save: function () {
        var _act = this.get("act");

        var jsonPlace = {
            id: this.get("id"),
            seller:this.get("seller"),
            name: this.get("name"),
            category: App.CategoryController.getItem(this.get("category")),
            status: this.get("status"),
            tag: this.get("tag"),
            startDate: this.get("startDate"),
            endDate: this.get("endDate"),
            desc: this.get("desc"),
            images: this.get("images") || [{ "id": 1, "url": "/images/placemap_pic.png" }, { "id": 2, "url": "/images/placemap_pic.png" }]
        };

        if (_act == "insert") {
            api.ms.insertpromotion(JSON.stringify(jsonPlace), function () {
                if (arguments[0] == "error") {
                    $("#modalAlert").alert("warning", "添加促销活动失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "添加促销活动成功！  ");
                    $('#modalAddMap').modal('hide')
                }
            });
        }
        else if (_act == "update") {
            api.ms.updatepromotion(JSON.stringify(jsonPlace), function () {
                if (arguments[0] == "error") {
                    $("#modalAlert").alert("warning", "编辑促销活动失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "编辑促销活动成功！  ");
                    $('#modalAddMap').modal('hide')
                }
            });
        }

        api.ms.getpromotion(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取促销活动失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = [];
                for (var i = 0; i < data.length; i++) {
                    json.push(JSON.parse(data[i]));
                }

                App.ActivityController.create(json);
            }
        });
    },
    create: function (act, item) {
        if (item != undefined) {
            this.set("id", item.id);
            this.set("seller", item.seller);
            this.set("name", item.name);
            this.get("category", App.CategoryController.getItem(item.category));
            this.get("status", item.status);
            this.get("tag", item.tag);
            this.get("startDate", item.startDate);
            this.get("endDate", item.endDate);
            this.set("desc", item.desc); 
            this.set("images", item.images); 
        }
        if (act) {
            this.set("act", act);
            switch (act) {
                case "update": this.set("title", "编辑促销活动"); break;
                case "detail": this.set("title", "查看促销活动"); break;
                default: this.set("title", "添加促销活动");
            }
        }
    }
});

App.CategoryController = Ember.ArrayController.create({
    content: [],
    init: function () {
        var cats = [{
            id: 1,
            name: "鞋"
        }, {
            id: 2,
            name: "衣服"
        }, {
            id: 3,
            name: "日用品"
        }];
        for (var i = 0; i < cats.length; i++) {
            this.get("content").pushObject(App.CategoryModel.create({
                id: cats[i].id,
                name: cats[i].name
            }));
        }
    },
    getItem: function (item) {
        var result = item;
        var id = item;
        if (item) {
            if (typeof item === "object") {
                id = item.id;
            }
            var controller = this.get("content");
            for (var i = 0; i < controller.length; i++) {
                if (id == controller[i].id) {
                    result = controller[i];
                    break;
                }
            }
        }
        return result;
    }
});

/*******************
***  Initialize  ***
*******************/
App.initializer({
    name: "merchantspromotion",
    initialize: function () {
        api.ms.getpromotion(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取促销活动失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = [];
                for (var i = 0; i < data.length; i++) {
                    json.push(JSON.parse(data[i]));
                }

                App.ActivityController.create(json);
            }
        });
    }
});

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