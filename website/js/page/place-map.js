App.CurrentMenu = 'li-place-map';

/*******************
***     View    ***
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
App.PlaceController = Ember.ObjectController.create({
    id:null,
    name: null,
    maps: null,
    insert: function () {
        App.ModalController.create(this.get("id"), this.get("name"), null, this.get("maps"), "insert");
    },
    detail: function (id) {
        var _maps = this.get("maps");
        for (var i = 0; i < _maps.length; i++) {
            if (_maps[i].id == id)
            {
                App.ModalController.create(this.get("id"), this.get("name"), id, this.get("maps"), "detail");
                break;
            }
        }
    },
    update: function (id) {
        for (var i = 0; i < _maps.length; i++) {
            if (_maps[i].id == id) {
                App.ModalController.create(this.get("id"), this.get("name"), id, this.get("maps"), "update");
                break;
            }
        }
    },
    remove: function (item) {
        api.ms.deleteplacemap(item, function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "删除场所地图失败！  " + arguments[1].message);
            } else  {
                $("#divAlert").alert("success", "删除场所地图成功！  ");
            }
        });
    },
    init: function () {
        var _this = this;
        api.ms.getplacemaps(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所地图失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
                _this.set("id", json.id);
                _this.set('name', json.name);
                _this.set('maps', json.maps);
            }
        });
    },
    restart: function () {
        var _this = this;
        api.ms.getplacemaps(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所地图失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
                _this.set('maps', json.maps);
            }
        });
    }
});

App.ModalController = Ember.ObjectController.create({
    title: null,
    placeid: null,
    placename: null,
    mapid: null,
    mapname: null,
    url: null,
    maps: null,
    act: null,
    save: function () {
        var _act = this.get("insert");

        var jsonPlace = {
            id: this.get("placeid"),
            name: this.get("placename"),
            maps: this.get("maps") || []
        };

        if (_act == "insert") {
            jsonPlace.maps.sort(function (x,y) {
                if (x > y)
                    return -1;
                if (x < y)
                    return 1;
            })
            var id=1;
            if (jsonPlace.maps.length > 0) {
                id = jsonPlace.maps[0].id + 1;
            }

            var map = {
                id: id,
                name: this.get("mapname"),
                url: this.get("url")
            };
            jsonPlace.maps.push(map);

            api.ms.insertplacemap(JSON.stringify(jsonPlace), function () {
                if (arguments[0] == "error") {
                    $("#divAlert").alert("warning", "添加场所地图失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "添加场所地图成功！  " );
                }
            });
        }
        else if (_act == "update") {
            var map = { id: this.get("mapid"), name: this.get("mapname"), url: this.get("url") };
            for (var i = 0; i < jsonPlace.maps.length; i++)
            {
                if (jsonPlace.maps[i].id == map.id)
                {
                    jsonPlace.maps[i].name = map.name;
                    jsonPlace.maps[i].url = map.url;
                    break;
                }
            }
            api.ms.updateplacemap(JSON.stringify(jsonPlace),function () {
                if (arguments[0] == "error") {
                    $("#divAlert").alert("warning", "编辑场所地图失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "编辑场所地图成功！  ");
                }
            });
        }

        App.PlaceController.restart();
    },
    create: function (placeid, placename, mapid, maps, act) {
        this.set("placeid", placeid);
        this.set("placename", placename);
        this.set("mapid", mapid);

        maps = maps || [];
        for (var i = 0; i < maps.length; i++) {
            if(maps[0].id==mapid){
                this.set("mapname", maps[0].name);
                this.set("url", maps[0].url);
                break;
            }
        }
        this.set("maps", maps);
        this.set("act", act);
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