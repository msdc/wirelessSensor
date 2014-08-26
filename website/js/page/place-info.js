App.CurrentMenu = 'li-place-info';

/*******************
***     View    ***
*******************/
App.ImageView = Ember.View.extend({
    templateName: 'image'
});

App.TextFileView = Ember.TextField.extend({
    classNames: ['hide'],
    type: 'file',
    attributeBindings: ['multiple'],
    multiple: "multiple",
    valueDidChange: function () {
        var pic = this.get("value");
        var valueId = this.get("content");
    }.observes('value')
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
    id: null,
    name: null,
    desc: null,
    images: null,
    actions: {
        save: function () {
            var json = { id: this.get("id"), name: this.get("name"), desc: this.get("desc"), descImages: this.get("images") };
            var jsondata = JSON.stringify(json);
            //var j = {
            //    "Id": 1,
            //    "name": "西单大悦城-test",
            //    "desc": "西单大悦城",
            //    "position": {
            //        "lat": 23.1231233,
            //        "lng": 34.2312323
            //    },
            //    "descImages": [
            //        {
            //            "id": 1,
            //            "url": "/images/palceinfor_pic1.jpg"
            //        },
            //        {
            //            "id": 2,
            //            "url": "/images/palceinfor_pic2.jpg"
            //        }
            //    ],
            //    "maps": [
            //        {
            //            "id": 1,
            //            "name": "一楼",
            //            "url": "/images/placemap_pic.png",
            //            "matrixID": "place_floor_matrix",
            //            "matrixSize": {
            //                "x": 800,
            //                "y": 900
            //            },
            //            "imageSize": {
            //                "width": 0,
            //                "height": 0
            //            },
            //            "canvasSize": {
            //                "width": 22,
            //                "height": 0
            //            },
            //            "scale": "1:10000"
            //        },
            //        {
            //            "id": 2,
            //            "name": "二楼",
            //            "url": "/images/placemap_pic.png",
            //            "matrixID": "place_floor_matrix",
            //            "matrixSize": {
            //                "x": 800,
            //                "y": 900
            //            },
            //            "imageSize": {
            //                "width": 0,
            //                "height": 0
            //            },
            //            "canvasSize": {
            //                "width": 22,
            //                "height": 0
            //            },
            //            "scale": "1:10000"
            //        }
            //    ]
            //}
            //api.ms.insertplace(JSON.stringify(j), function () {
            //    if (arguments[0] == "error") {
            //        $("#divAlert").alert("warning", "添加场所信息失败！  " + arguments[1].message);
            //    } else {
            //        $("#divAlert").alert("success", "添加场所信息成功！");
            //    }
            //});
            api.ms.updateplace(jsondata, function () {
                if (arguments[0] == "error") {
                    $("#divAlert").alert("warning", "编辑场所信息失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "辑场所信息成功！");
                }
            });
        },
        upload: function () {
            $("#fileImg").click();
        }
    },
    init: function () {
        var _this = this;
        api.ms.getplace(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所信息错误！ " + arguments[1].message)
            }
            else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
                _this.set('id', json.id);
                _this.set('name', json.name);
                _this.set('desc', json.desc);
                _this.set('images', json.descImages);
            }
        });
    }
});


/*******************
***  Initialize  ***
*******************/
App.initializer();