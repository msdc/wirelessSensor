; var api = (function ($) {
    $.apidata = function () {
        $.extend(this, {
            ajax: function (url, type, data, callback) {
                $.ajax({
                    url: url,
                    type: type,
                    data: data,
                    async: false,
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        callback(data);
                    },
                    error: function (xhr, status, error) {
                        callback("error", error);
                    }
                });
            },
            ajaxfile: function (formData, callback) {
                var url = GetUrlRoot() + "fileUpload";
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: formData,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: callback,
                    error: function (xhr, status, error) {
                        callback("error", error);
                    }
                });
            },
            headurl: "http://localhost:1337/",
            mergeurl: function (url) {
                return this.headurl + url;
            },
            ms: {
                apiajax: this,
                insertplace: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("place/add"), "Post", json, callback);
                },
                updateplace: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("place/update"), "Post", json, callback);
                },
                getplace: function (callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("place/get"), "Get", null, callback);
                },
                insertplacemap: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("place/update"), "Post", json, callback);
                },
                updateplacemap: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("place/update"), "Post", json, callback);
                },
                deleteplacemap: function (item, callback) {
                    var url = "place/del?id=" + item.id + "&name=" + item.name;
                    this.apiajax.ajax(this.apiajax.mergeurl(url), "Delete", null, callback);
                },
                getplacemaps: function (callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("place/get"), "Get", null, callback);
                },
                insertplacemerchant: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("seller/add"), "Post", json, callback);
                },
                updateplacemerchant: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("seller/update"), "Post", json, callback);
                },
                deleteplacemerchant: function (item, itemcallback) {
                    var url = "seller/del?id=" + item.id + "&name=" + item.name;
                    this.apiajax.ajax(this.apiajax.mergeurl(url), "Delete", null, callback);
                },
                getplacemerchants: function (callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("seller/get"), "Get", null, callback);
                },
                insertdevice: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("device/add"), "Post", json, callback);
                },
                updatedevice: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("device/update"), "Post", json, callback);
                },
                deletedevice: function (item, callback) {
                    var url = "device/del?id=" + item.id + "&name=" + item.name;
                    this.apiajax.ajax(this.apiajax.mergeurl(url), "delete", null, callback);
                },
                getdevice: function (callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("device/get"), "Get", null, callback);
                },
                insertpromotion: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("promotion/add"), "Post", json, callback);
                },
                updatepromotion: function (json, callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("promotion/update"), "Post", json, callback);
                },
                deletepromotion: function (item,callback) {
                    var url = "promotion/del?id=" + item.id + "&name=" + item.name;
                    this.apiajax.ajax(this.apiajax.mergeurl(url), "delete", null, callback);
                },
                getpromotion: function (callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("promotion/get"), "Get", null, callback);
                }
            }
        });
    }

    var  instance;
    function singleton() {
        if (instance === undefined || instance === null) {
            instance = new $.apidata();
        }
        return instance;
    }

    return singleton();
})(jQuery);