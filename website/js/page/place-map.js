﻿App.CurrentMenu = 'li-place-map';

/*******************
***     View    ***
*******************/
App.PlaceView = Ember.View.extend({
    templateName: 'place',
    contentBinding: 'App.PlaceController',
    onRerender: function () {
        this.rerender();
    }.observes('content.maps')
});

App.ModalView = Ember.View.extend({
    templateName: 'modal',
    contentBinding: 'App.ModalController'
});

/*******************
***     Model    ***
*******************/
App.MapModel = Em.Object.extend({
    id: null,
    name: null,
    url: null
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
App.PlaceController = Ember.ObjectController.create({
    id:null,
    name: null,
    removeItem:null,
    maps: [],
    insert: function () {
        App.ModalController.create(this.get("id"), this.get("name"), null, this.get("maps"), "insert");
    },
    //detail: function (id) {
    //    var _maps = this.get("maps");
    //    for (var i = 0; i < _maps.length; i++) {
    //        if (_maps[i].id == id)
    //        {
    //            App.ModalController.create(this.get("id"), this.get("name"), id, this.get("maps"), "detail");
    //            break;
    //        }
    //    }
    //},
    update: function (id) {
        var _maps = this.get("maps");
        for (var i = 0; i < _maps.length; i++) {
            if (_maps[i].id == id) {
                App.ModalController.create(this.get("id"), this.get("name"), id, this.get("maps"), "update");
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
        api.ms.deleteplacemap(this.get("removeItem"), function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "删除场所地图失败！  " + arguments[1].message);
            } else {
                $("#divAlert").alert("success", "删除场所地图成功！  ");
            }
        });
    },
    removeAll: function () {
        var maps = this.get('maps');
        var arg = maps || [].copy();
        for (var i = 0; i < arg.length; i++) {
            this.get('maps').removeObject(arg[i]);
        }
    },
    create: function (id,name,maps) {
        this.set("id", id);
        this.set('name', name);
        this.removeAll();
        for (var i = 0; i < maps.length; i++) {
            this.get('maps').pushObject(App.MapModel.create({
                id: maps[i].id,
                name: maps[i].name,
                url: maps[i].url
            }));
        }
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
        var _act = this.get("act");

        var jsonPlace = {
            id: this.get("placeid"),
            name: this.get("placename"),
            maps: this.get("maps") || []
        };

        if (_act == "insert") {
            jsonPlace.maps.sort(function (x,y) {
                if (x.id > y.id)
                    return -1;
                if (x.id < y.id)
                    return 1;
            })
            var id=1;
            if (jsonPlace.maps.length > 0) {
                id = jsonPlace.maps[0].id + 1;
            }

            var map = {
                id: id,
                name: this.get("mapname"),
                url: this.get("url") || "/images/placemap_pic.png"
            };
            jsonPlace.maps.push(map);

            api.ms.insertplacemap(JSON.stringify(jsonPlace), function () {
                if (arguments[0] == "error") {
                    $("#modalAlert").alert("warning", "添加场所地图失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "添加场所地图成功！  ");
                    $('#modalAddMap').modal('hide')
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
                    $("#modalAlert").alert("warning", "编辑场所地图失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "编辑场所地图成功！  ");
                    $('#modalAddMap').modal('hide')
                }
            });
        }

        api.ms.getplacemaps(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所地图失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
                App.PlaceController.create(json.id, json.name, json.maps);
            }
        });
    },
    create: function (placeid, placename, mapid, maps, act) {
        this.set("placeid", placeid);
        this.set("placename", placename);
        this.set("mapid", mapid);

        maps = maps || [];
        for (var i = 0; i < maps.length; i++) {
            if(maps[i].id==mapid){
                this.set("mapname", maps[i].name);
                this.set("url", maps[i].url);
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
App.initializer({
    name: "placemap",
    initialize: function () {
        api.ms.getplacemaps(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所地图失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
                App.PlaceController.create(json.id, json.name, json.maps);
            }
        });
    }
});