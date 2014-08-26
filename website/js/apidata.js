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
                        callback(status);
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
                        alert(status);
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
                insertplacemap: function () { },
                updateplacemap: function () { },
                deleteplacemap: function () { },
                getplacemaps: function (callback) {
                    this.apiajax.ajax(this.apiajax.mergeurl("place/get"), "Get", null, callback);
                },
                insertplacemerchant: function () { },
                updateplacemerchant: function () { },
                deleteplacemerchant: function () { },
                getplacemerchants: function () { }
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