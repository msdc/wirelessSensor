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
            var data=JSON.stringify(json);
            //api.ms.updateplace(data, function (data) {
            //    var d = data;
            //});
            $("#divAlert").alert("success", "场所信息保存成功！");
        },
        upload: function () {
            $("#fileImg").click();
        }
    },
    init: function () {
        var _this = this;
        api.ms.getplace(function (data) {
            if (data == "error")
            {
                $("#divAlert").alert("warning","获取场所信息错误！")
            }
            else if (data.length > 0) {
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