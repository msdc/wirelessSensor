App.CurrentMenu = 'li-place-map';

/*******************
***     View    ***
*******************/

App.ModalView = Ember.View.extend({
    templateName: 'modal',
    contentBinding: 'App.ModalController'
});

/*******************
***     Model    ***
*******************/


/*******************
***    Router    ***
*******************/
App.Router.map(function () {
    this.resource('container', { path: '/' }, function () {
        this.resource('place', { path: '/' });
    });
});

/*******************
***   Control    ***
*******************/
App.PlaceController = Ember.ObjectController.extend({
    name: null,
    maps: null,
    actions: {
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
        }
    },
    init: function () {
        var _this = this;
        api.ms.getplace(function (data) {
            _this.set('name', data.name);
            _this.set('maps', data.maps);
        });
    }
});

App.ModalController = Ember.ObjectController.create({
    title: '添加地图',
    placename: "dd",
    mapname: "ddd",
    map: "",
    act: "insert",
    save: function () {
        var json = {
            "id": 1,
            "name": "一楼",
            "url": "/images/placemap_pic.png",
            "matrixID": "place_floor_matrix",
            "matrixSize": {
                "x": 800,
                "y": 900
            },
            "imageSize": {
                "width": 0,
                "height": 0
            },
            "canvasSize": {
                "width": 22,
                "height": 0
            },
            "scale": "1:10000"
        }

        
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
***  Initialize  ***
*******************/
App.initialize();