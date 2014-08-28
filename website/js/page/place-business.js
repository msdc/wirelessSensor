App.CurrentMenu = 'li-place-business';

/*******************
***     View    ***
*******************/
App.PlaceView = Ember.View.extend({
    templateName: 'place',
    contentBinding: 'App.PlaceController'   
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
App.SellerModel = Em.Object.extend({
    id: null,
    name: null,
    logo: null,
    category: null,
    status: null,
    promotionNumber: null,
    tag: null,
    desc: null,
    images:[]
});

App.CategoryModel = Em.Object.extend({
    id: null,
    name:null
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
App.PlaceController = Ember.ArrayController.create({
    id:null,
    name: null,
    removeItem:null,
    content: [],
    insert: function () {
        var sellers = this.get("content");
        sellers.sort(function (x, y) {
            if (x.id > y.id)
                return -1;
            if (x.id < y.id)
                return 1;
        })
        var id = 1;
        if (sellers.length > 0) {
            id = sellers[0].id + 1;
        }
        App.ModalController.create("insert", { id: id });
    },
    update: function (id) {
        var sellers = this.get("content");
        for (var i = 0; i < sellers.length; i++) {
            if (sellers[i].id == id) {
                App.ModalController.create("update", sellers[i]);
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
        var item = this.get("removeItem");
        api.ms.deleteplacemerchant(item, function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "删除场所地图失败！  " + arguments[1].message);
            } else {
                $("#divAlert").alert("success", "删除场所地图成功！  ");
                this.get('content').removeObject(item);
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
    create: function (sellers, id, name) {
        if (id != undefined) { this.set("id", id); }
        if (name != undefined) { this.set('name', name); }
        this.removeAll();
        sellers = sellers || [];
        for (var i = 0; i < sellers.length; i++) {
            this.get('content').pushObject(App.SellerModel.create({
                id: sellers[i].id,
                name: sellers[i].name,
                logo: sellers[i].logo,
                category: App.CategoryController.getItem(sellers[i].category),
                status: sellers[i].status,
                promotionNumber: sellers[i].promotionNumber,
                tag: sellers[i].tag,
                desc: sellers[i].desc,
                images: sellers[i].images
            }));
        }
    }
});

App.ModalController = Ember.ObjectController.create({
    title: null,
    id:null,
    name: null,
    logo: null,
    category: null,
    status: null,
    promotionNumber: null,
    tag: null,
    desc: null,
    images: [],
    act: null,
    save: function () {
        var _act = this.get("act");

        var jsonPlace = {
            id: this.get("id"),
            logo: this.get("logo") || "images/placebusi_pic.jpg",
            name: this.get("name"),
            category: App.CategoryController.getItem(this.get("category")),
            status: this.get("status"),
            promotionNumber: this.get("promotionNumber"),
            tag: this.get("tag"),
            desc: this.get("desc"),
            images: this.get("images") || [{ "id": 1, "url": "/images/placemap_pic.png" }, { "id": 2, "url": "/images/placemap_pic.png" }]
        };

        if (_act == "insert") {
            api.ms.insertplacemerchant(JSON.stringify(jsonPlace), function () {
                if (arguments[0] == "error") {
                    $("#modalAlert").alert("warning", "添加场所商家失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "添加场所商家成功！  ");
                    $('#modalAddBusiness').modal('hide')
                }
            });
        }
        else if (_act == "update") {
            api.ms.updateplacemerchant(JSON.stringify(jsonPlace), function () {
                if (arguments[0] == "error") {
                    $("#modalAlert").alert("warning", "编辑场所商家失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "编辑场所商家成功！  ");
                    $('#modalAddBusiness').modal('hide')
                }
            });
        }
       
        api.ms.getplacemerchants(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所商家失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = [];
                for (var i = 0; i < data.length; i++) {
                    json.push(JSON.parse(data[i]));
                }
                App.PlaceController.create(json);
            }
        });
    },
    create: function (act, item) {
        if (item != undefined) {
            this.set("id", item.id);
            this.set("logo", item.logo);
            this.set("name", item.name);
            this.set("category", item.category);
            this.set("status", item.status);
            this.set("promotionNumber", item.promotionNumber);
            this.set("tag", item.tag);
            this.set("desc", item.desc);
            this.set("images", item.images);
        }

        this.set("act", act);
        switch (act) {
            case "update": this.set("title", "编辑商家"); break;
            case "detail": this.set("title", "查看商家"); break;
            default: this.set("title", "添加商家");
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
        return result;
    }
});
    

/*******************
***  Initialize  ***
*******************/
App.initializer({
    name: "placebusiness",
    initialize: function () {
        api.ms.getplace(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取场所失败！  " + arguments[1].message);
            } else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
               
                api.ms.getplacemerchants(function () {
                    var business = [];
                    if (arguments[0] == "error") {
                        $("#divAlert").alert("warning", "获取场所商家失败！  " + arguments[1].message);
                    } else if (arguments[0].length > 0) {
                        var mdata = arguments[0];
                        for (var i = 0; i < mdata.length; i++) {
                            business.push(JSON.parse(mdata[i]));
                        }
                    }
                    App.PlaceController.create(business, json.id, json.name);
                });
            }
        });        
    }
});
