App.CurrentMenu = 'li-business-info';

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
        this.resource('business', { path: '/' });
    });
});

/*******************
***   Control    ***
*******************/
App.BusinessController = Ember.ObjectController.extend({
    id: null,
    name: null,
    category:null,
    tag:null,
    desc: null,
    images: null,
    categorys: [{
        "id": 1,
        "name": "鞋"
    }, {
        "id": 2,
        "name": "衣服"
    }, , {
        "id": 3,
        "name": "日用品"
    }],
    actions: {
        save: function () {
            var json = {
                id: this.get("id"),
                name: this.get("name"),
                category: this.get("category"),
                tag:this.get("tag"),
                desc: this.get("desc"),
                images: this.get("images")
            };
            var jsondata = JSON.stringify(json);
            api.ms.updateplacemerchant(jsondata, function () {
                if (arguments[0] == "error") {
                    $("#divAlert").alert("warning", "编辑商家信息失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "编辑商家信息成功！");
                }
            });
        },
        upload: function () {
            $("#fileImg").click();
        }
    },
    init: function () {
        var _this = this;
        api.ms.getplacemerchants(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取商家信息错误！ " + arguments[1].message)
            }
            else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);

                _this.set('id', json.id);
                _this.set('name', json.name);
                _this.set('category', json.category);
                _this.set('tag', json.tag);
                _this.set('desc', json.desc);
                _this.set('images', json.images);
            }
        });
    }
});


/*******************
***  Initialize  ***
*******************/
App.initialize();