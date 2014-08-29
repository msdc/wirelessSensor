App.CurrentMenu = 'li-business-location';

/*******************
***     View    ***
*******************/


/*******************
***     Model    ***
*******************/

/*******************
***   Control    ***
*******************/

App.BusinessController = Ember.ObjectController.extend({
    id: null,
    name: null,
    logo:null,
    location:null,
    actions: {
        save: function () {
            var json = { id: this.get("id"), location: this.get("location") };
            var jsondata = JSON.stringify(json);
            api.ms.updateplacemerchant(jsondata, function () {
                if (arguments[0] == "error") {
                    $("#divAlert").alert("warning", "编辑商家位置失败！  " + arguments[1].message);
                } else {
                    $("#divAlert").alert("success", "编辑商家位置成功！");
                }
            });
        }
    },
    init: function () {
        var _this = this;
        //set default value
        _this.set('id', 1);
        api.ms.getplacemerchants(function () {
            if (arguments[0] == "error") {
                $("#divAlert").alert("warning", "获取商家位置错误！ " + arguments[1].message)
            }
            else if (arguments[0].length > 0) {
                var data = arguments[0];
                var json = JSON.parse(data[0]);
                if (json.id) {
                    _this.set('id', json.id);
                }
                if (json.name) {
                    _this.set('name', json.name);
                }
                if (json.logo) {
                    _this.set('logo', json.logo);
                }
                if (json.location) {
                    _this.set('location', json.location);
                    $('#MVC_merchantsLocation').val(json.location.x+','+json.location.y);
                }
            }
            $('body').delegate('#MVC_merchantsLocation',"click",function(){
                console.log('改变:',$(this).val());
                var val=$(this).val().split(',');
                _this.setLocation({x:val[0],y:val[1]});
                $(this).attr('location',{x:val[0],y:val[1]});
            })
        });
    },
    setLocation:function(obj){
        if(obj){this.set("location",obj);}
    },
    getLocation:function(){
        return this.get("location");
    }
});


/*******************
***    Router    ***
*******************/
App.Router.map(function () {
    this.resource('container', { path: '/' }, function () {
        this.resource('business', { path: '/' });
    });
});

/*******************
***  Initialize  ***
*******************/
App.initialize();
