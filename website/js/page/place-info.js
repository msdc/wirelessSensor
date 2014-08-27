App.CurrentMenu = 'li-place-info';

/*******************
***     View    ***
*******************/
App.TextFileView = Ember.TextField.extend({
    classNames: ['hide'],
    type: 'file',
    attributeBindings: ['multiple'],
    multiple: "multiple",
    valueDidChange: function () {
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
            api.ms.updateplace(jsondata, function () {
                if (arguments[0] == "error") {
                    $("#divAlert").alert("warning", "编辑场所信息失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "编辑场所信息成功！");
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
App.initialize();