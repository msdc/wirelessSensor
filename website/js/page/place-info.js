App.CurrentMenu = 'li-place-info';

/*******************
***     View    ***
*******************/
App.ContainerView = Ember.View.extend({
    templateName: 'container'
});

App.ImageView = Ember.View.extend({
    templateName: 'image'
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
            var json = { "id": 1, "name": "西单大悦城", "desc": "西单大悦城", "position": { "lat": 23.1231233, "lng": 34.2312323 }, "descImages": [{ "id": 1, "url": "/images/palceinfor_pic1.jpg" }, { "id": 2, "url": "/images/palceinfor_pic2.jpg" }, { "id": 3, "url": "/images/palceinfor_pic3.jpg" }], "maps": [{ "id": 1, "name": "一楼", "url": "/images/placemap_pic.png", "matrixID": "place_floor_matrix", "matrixSize": { "x": 800, "y": 900 }, "imageSize": { "width": 0, "height": 0 }, "canvasSize": { "width": 22, "height": 0 }, "scale": "1:10000" }, { "id": 2, "matrixID": "place_floor_matrix", "matrixSize": { "x": 800, "y": 900 }, "imageSize": { "width": 0, "height": 0 }, "canvasSize": { "width": 22, "height": 0 }, "scale": "1:10000" }] };
            var jsonStr=JSON.stringify(json);
            api.ms.insertplace(jsonStr, function (data) {
                var d = data;
            });
        }
    },
    init: function () {
        var _this = this;
        api.ms.getplace(function (data) {
            _this.set('id', data.id);
            _this.set('name', data.name);
            _this.set('desc', data.desc);
            _this.set('images', data.images);
        });
    }
});


/*******************
***  Initialize  ***
*******************/
App.initializer();