App.CurrentMenu = 'li-place-business';

/*******************
***     View    ***
*******************/


/*******************
***     Model    ***
*******************/
App.PlaceView = Ember.View.extend({
    templateName: 'place',
    contentBinding: 'App.PlaceController'
});

App.ModalView = Ember.View.extend({
    templateName: 'modal',
    contentBinding: 'App.ModalController'
});

/*******************
***   Control    ***
*******************/
App.PlaceController = Ember.ArrayController.create({
    name: null,
    content: [],
    insert: function () {
        App.ModalController.create(this.get("name"), null, null, "insert");
    },
    detail: function () {
        //alert("detail");
        App.ModalController.create(this.get("name"), null, null, "detail");
    },
    update: function () {
        // alert("update");
        App.ModalController.create(this.get("name"), null, null, "update");
    },
    remove: function () {
        alert("remove");
    },
    init: function () {
        var _this = this;
        api.ms.getplacemerchants(function (data) {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所商家失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
                _this.set('content', json);
            }
        });
    },
    restart: function () {
        var _this = this;
        api.ms.getplacemerchants(function (data) {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所商家失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
                _this.set('content', json);
            }
        });
    }
});

App.ModalController = Ember.ObjectController.create({
    title: '添加商家',
    placename: null,
    mapname: null,
    map: null,
    act: "insert",
    save: function () {
        //App.PlaceController.restart();
    },
    create: function (placename, mapname, map, act) {
        this.set("placename", placename);
        this.set("mapname", mapname);
        this.set("map", map);
        switch (act) {
            case "update": this.set("title", "编辑地图"); break;
            case "detail": this.set("title", "查看地图"); break;
            default: this.set("title", "添加地图");
        }
    }
});

/*******************
***    Router    ***
*******************/
App.Router.map(function () {
    this.resource('container', { path: '/' });
});

/*******************
***  Initialize  ***
*******************/
App.initialize();