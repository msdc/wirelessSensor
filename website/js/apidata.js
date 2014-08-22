; (function ($) {
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
                    success: callback(result),
                    error: function (xhr, status, error) {
                        alert(status);
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
            ms: {
                updateplace:function(){

                },
                getplace: function () {

                },
                insertplacemap: function () { },
                updateplacemap: function () { },
                deleteplacemap:function(){},
                getplacemaps: function () {

                },
                insertplacemerchant: function () { },
                updateplacemerchant: function () { },
                deleteplacemerchant:function(){},
                getplacemerchants: function () { }
            }
        });
    }
})(jQuery);