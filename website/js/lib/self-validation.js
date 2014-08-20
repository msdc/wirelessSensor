; (function ($) {
    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                return i;
            }
        }
        return -1;
    }

    Array.prototype.clone = function () {
        return [].concat(this);
    }

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index != -1) {
            this.splice(index, 1);
        }
    }

    $.validator = function (options) {
        $.extend(this, {
            defaults: {
                elements: $("[id^='validate_']"),
                errorClass: undefined,
                validClass: undefined,
                messageClear: undefined,
                errorPlacement: function (element, message) {
                    if (this.messageClear != undefined)
                        this.messageClear(element);
                    this.innertMessage(element, message, this.errorClass);
                },
                successPlacement: function (element) {
                    if (this.messageClear != undefined)
                        this.messageClear(element);
                    this.innertMessage(element, undefined, this.validClass);
                },
                innertMessage: function (element, message, className) {
                    var validateElm = element.parent().children("span[name=validate]");
                    if (validateElm.length === 0)
                        validateElm = $("<span name='validate'/>");
                    else validateElm = $(validateElm[0]);
                    validateElm.removeAttr("class").addClass(className).empty().append(message).insertAfter(element);
                },
                rules: {},
                messages: {
                    required: "&nbsp;此字段是必填",
                    maxlength: "&nbsp;请输入不超过{0}个字符",
                    minlength: "&nbsp;至少输入{0}个字符.",
                    rangelength: "&nbsp;请输入一个值介于{0}和{1}个字符长",
                    range: "&nbsp;请输入一个{0} 和 {1} 之间的值",
                    max: "&nbsp;请输入一个小于等于{0}值",
                    min: "&nbsp;请输入一个大于等于{0}值",
                    equalTo: "&nbsp;请输入相同的值再次",
                    number: "&nbsp;请输入一个有效的数字",
                    digits: "&nbsp;请输入数字",
                    date: "&nbsp;请输入一个有效的日期",
                    dateISO: "&nbsp;请输入一个有效的ISO日期",
                    telepone: "&nbsp;请输入一个有效的电话",
                    mobilePhone: "&nbsp;请输入一个有效的手机号",
                    email: "&nbsp;请输入一个有效的邮箱",
                    url: "&nbsp;请输入一个有效的链接",
                    remote: "&nbsp;输入已存在",
                    regexp: "&nbsp;请输入有效数据",
                    sync: "&nbsp;请输入合法数据"
                }
            },
            init: function (settings) {
                this.setDefaults(settings);
                this.methodMap();
                this.bindVerify();

                this.validating.create();
                this.validating.bindEvent();
            },
            setDefaults: function (settings) {
                this.defaults = $.extend(true, {}, this.defaults, settings);
            },
            getMessagesItem: function (name) {
                var value = "";
                var _this = this;

                for (var key in this.defaults.messages) {
                    if (key === name) {
                        value = this.defaults.messages[key];
                        break;
                    }
                }

                return value;
            },
            getElements: function () {
                return this.defaults.elements;
            },
            bindVerify: function () {
                this.verify(true);
            },
            fail: function (element, message) {
                this.defaults.errorPlacement(element, message);
            },
            success: function (element) {
                this.defaults.successPlacement(element, undefined);
            },
            validating: {
                create: function () {
                    var validatDiv = $('<div id="validatDiv" style="position:absolute; z-index:999; display:none; background-color:#000; opacity:0.5; top:0px; width:100%; height:100%; font-size:18px; color:#fff; font-weight:bold; text-align:center; "></div>');
                    var innerDiv = $('<div style="position:fixed;width:160px; height:50px; background-color:#0539a5; line-height:50px;">数据验证中......</div>');

                    var documentWidth = $(window).width();
                    var documentHeight = $(window).height();

                    validatDiv.css("line-height", documentHeight + "px");

                    innerDiv.offset({ left: documentWidth / 2 - 80, top: documentHeight / 2 - 25 });

                    validatDiv.append(innerDiv);
                    $("body").append(validatDiv);
                },
                show: function () {
                    var $validatDiv = $("#validatDiv");
                    if ($validatDiv.length > 0) {
                        $validatDiv.show();
                    }
                },
                hide: function () {
                    var $validatDiv = $("#validatDiv");
                    if ($validatDiv.length > 0) {
                        $validatDiv.hide();
                    }
                },
                remove: function () {
                    var $validatDiv = $("#validatDiv");
                    if ($validatDiv.length > 0) {
                        $validatDiv.remove();
                    }
                },
                bindEvent: function () {
                    var _this = this;
                    window.onresize = function () {
                        var $validatDiv = $("#validatDiv");
                        if ($validatDiv.length > 0) {
                            _this.create();
                        }
                    }

                    window.onscroll = function () {
                        var $validatDiv = $("#validatDiv");
                        if ($validatDiv.length > 0) {
                            var scrollTop = $(document).scrollTop();
                            $validatDiv.css("top", scrollTop + "px");
                        }
                    }
                }
            },
            showMessage: function () {
                var result = true;

                var cloneSuccessList = this.results.successList.clone();
                var cloneErrorList = this.results.errorList.clone();
                var clonependingList = this.results.pendingList.clone();

                for (var index in cloneSuccessList) {
                    if (!isNaN(index)) {
                        this.success(cloneSuccessList[index].element);
                        this.results.successList.remove(cloneSuccessList[index]);
                    }
                }

                for (var index in cloneErrorList) {
                    if (!isNaN(index)) {
                        result = false;

                        var error = cloneErrorList[index];
                        var message = this.format(this.getMessagesItem(error.name), error.param);
                        this.fail(error.element, message);

                        this.results.errorList.remove(error);
                    }
                }

                if (result && typeof this.submitCallback === "function") {
                    this.submitCallback();
                    this.submitCallback = undefined;
                }
            },
            verifyFunc: function (element, funs) {
                var _this = this;

                var result = true;
                for (var index in funs) {
                    if (!isNaN(index)) {
                        var name = funs[index].name, body = funs[index].body, param = funs[index].param;

                        if (name === "equalTo") {
                            var equalElm = $("#validate_" + param);
                            if (equalElm.length === 1)
                                param = equalElm;
                        }

                        var currentResult = body(_this, element, param);

                        if (currentResult === "pending") {
                            result = false;
                            this.results.pendingList.push({ element: element });
                            break;
                        }
                        else if (currentResult === "len-null") { result = false; }
                        else if (!currentResult) {
                            result = false;
                            this.results.errorList.push({ element: element, name: name, param: param });
                            break;
                        }
                    }
                }

                if (result) {
                    this.results.successList.push({ element: element });
                }
            },
            verifySingle: function (elemName) {
                var element, _this = this;
                this.getElements().each(function (i) {
                    element = $(this);
                    var id = element.attr("id").replace("validate_", "");
                    if (id === elemName) {
                        if (element.length != 0) {
                            for (var index in _this.methMap) {
                                if (!isNaN(index)) {
                                    var method = _this.methMap[index];
                                    if (method.elemName === elemName) {
                                        _this.verifyFunc(element, method.meths);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });
            },
            verify: function (isbindEvent) {
                var _this = this;
                this.getElements().each(function (i) {
                    var element = $(this);
                    var id = element.attr("id").replace("validate_", "");

                    for (var index in _this.methMap) {
                        if (!isNaN(index)) {
                            var method = _this.methMap[index];
                            if (method.elemName === id) {
                                if (isbindEvent) {
                                    _this.eventsVerifries.onfocusout(element, function () {
                                        _this.submitCallback = undefined;
                                        _this.verifyFunc(element, method.meths);
                                        _this.showMessage();
                                    });
                                } else {
                                    _this.verifyFunc(element, method.meths);
                                }
                                break;
                            }
                        }
                    }
                });
            },
            methods: {
                required: function (validate, element) {
                    return validate.getLength(validate.elementValue(element)) !== 0;
                },
                minlength: function (validate, element, param) {
                    if (validate.optional(element))
                        return "len-null";

                    if (typeof (param) == "number" || !isNaN(param)) {
                        return validate.getLength(validate.elementValue(element)) >= parseInt(param);
                    }
                    return true;
                },
                maxlength: function (validate, element, param) {
                    if (validate.optional(element))
                        return "len-null";

                    if (typeof (param) == "number" || !isNaN(param)) {
                        return validate.getLength(validate.elementValue(element)) <= parseInt(param);
                    }
                    return true;
                },
                rangelength: function (validate, element, range) {
                    if (validate.optional(element))
                        return "len-null";

                    if (typeof (range) == "object" && range.length) {
                        var length = validate.getLength(validate.elementValue(element));
                        return (length >= range[0] && length <= range[1]);
                    }
                    return true;
                },
                range: function (validate, element, range) {
                    if (validate.optional(element))
                        return "len-null";

                    if (typeof (range) == "object" && range.length) {
                        var value = validate.elementValue(element);
                        return (value >= range[0] && value <= range[1]);
                    }
                    return true;
                },
                min: function (validate, element, param) {
                    if (validate.optional(element))
                        return "len-null";

                    if (typeof (param) == "number" || !isNaN(param)) {
                        return validate.elementValue(element) >= parseInt(param);
                    }
                    return true;
                },
                max: function (validate, element, param) {
                    if (validate.optional(element))
                        return "len-null";

                    if (typeof (param) == "number" || !isNaN(param)) {
                        return validate.elementValue(element) <= parseInt(param);
                    }
                    return true;
                },
                equalTo: function (validate, element, equalElement) {
                    var value = validate.elementValue(element);
                    var equalValue = validate.elementValue(equalElement);
                    return value === equalValue;
                },
                number: function (validate, element) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
                },
                digits: function (validate, element) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return /^\d+$/.test(value);
                },
                date: function (validate, element) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return validate.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
                },
                dateISO: function (validate, element) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
                },
                telepone: function (validate, element) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return /\d{7,8}$/.test(value);
                },
                mobilePhone: function (validate, element) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return validate.optional(element) || /^1[3|4|5|8][0-9]\d{4,8}$/.test(value);
                },
                email: function (validate, element) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
                },
                url: function (validate, element) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
                },
                remote: function (validate, element, data) {
                    if (validate.optional(element))
                        return "len-null";

                    var result = "pending";
                    validate.validating.show();

                    if (typeof (data) === "object") {
                        $.ajax({
                            url: typeof data.url === "function" ? data.url() : data.url,
                            async: true,
                            success: function (response) {
                                result = response === true || response === "true";

                                validate.results.pendingList.remove({ element: element });

                                if (result) {
                                    validate.results.successList.push({ element: element });
                                    validate.success(element);
                                } else {
                                    validate.results.errorList.push({ element: element, name: "remote", param: true });
                                    var message = validate.format("remote", true);
                                    validate.fail(element, message);
                                }
                                setTimeout(validate.validating.hide, 500);
                            }
                        });
                    }
                    return result;
                },
                regexp: function (validate, element, reg) {
                    if (validate.optional(element))
                        return "len-null";

                    var value = validate.elementValue(element);
                    return reg.test(value);
                },
                sync: function (validate, element, callback) {
                    if (validate.optional(element))
                        return "len-null";

                    if (typeof callback === "function") {
                        return callback(element);
                    }
                    return false;
                }
            },
            eventsVerifries: {
                onfocusin: function (element, callback) {
                    element[0].onfocur = callback;
                },
                onfocusout: function (element, callback) {
                    element[0].onblur = callback;
                }
            },
            results: { successList: [], errorList: [], pendingList: [] },
            submitCallback: undefined,
            methodMap: function () {
                for (var key in this.defaults.rules) {
                    var value = this.defaults.rules[key];
                    var maps = [];
                    for (var k in value) {
                        var v = value[k];
                        if (v) {
                            switch (k) {
                                case "required":
                                    maps.push(this.setVerifriesObj("required", this.methods.required, v));
                                    break;
                                case "minlength":
                                    maps.push(this.setVerifriesObj("minlength", this.methods.minlength, v));
                                    break;
                                case "maxlength":
                                    maps.push(this.setVerifriesObj("maxlength", this.methods.maxlength, v));
                                    break;
                                case "rangelength":
                                    maps.push(this.setVerifriesObj("rangelength", this.methods.rangelength, v));
                                    break;
                                case "range":
                                    maps.push(this.setVerifriesObj("range", this.methods.range, v));
                                    break;
                                case "min":
                                    maps.push(this.setVerifriesObj("min", this.methods.min, v));
                                    break;
                                case "max":
                                    maps.push(this.setVerifriesObj("max", this.methods.max, v));
                                    break;
                                case "equalTo":
                                    funs.push(this.setVerifriesObj("equalTo", this.methods.equalTo, v));
                                    break;
                                case "number":
                                    maps.push(this.setVerifriesObj("number", this.methods.number, v));
                                    break;
                                case "digits":
                                    maps.push(this.setVerifriesObj("digits", this.methods.digits, v));
                                    break;
                                case "date":
                                    maps.push(this.setVerifriesObj("date", this.methods.date, v));
                                    break;
                                case "dateISO":
                                    maps.push(this.setVerifriesObj("dateISO", this.methods.dateISO, v));
                                    break;
                                case "telepone":
                                    maps.push(this.setVerifriesObj("telepone", this.methods.telepone, v));
                                    break;
                                case "mobilePhone":
                                    maps.push(this.setVerifriesObj("mobilePhone", this.methods.mobilePhone, v));
                                    break;
                                case "email":
                                    maps.push(this.setVerifriesObj("email", this.methods.email, v));
                                    break;
                                case "url":
                                    maps.push(this.setVerifriesObj("url", this.methods.url, v));
                                    break;
                                case "remote":
                                    maps.push(this.setVerifriesObj("remote", this.methods.remote, v));
                                    break;
                                case "regexp":
                                    maps.push(this.setVerifriesObj("regexp", this.methods.regexp, v));
                                    break;
                                case "sync":
                                    maps.push(this.setVerifriesObj("sync", this.methods.sync, v));
                                    break;
                            }
                        }
                    }
                    this.methMap.push({ elemName: key, meths: maps });
                }
            },
            methMap: [],
            optional: function (element) {
                var value = this.elementValue(element);
                return !this.methods.required(this, element);
            },
            setVerifriesObj: function (name, body, param) {
                return { name: name, body: body, param: param };
            },
            elementValue: function (element) {
                var type = element.attr("type"),
                    val = element.val();

                if (type === "radio" || type === "checkbox") {
                    return $("input[name='" + element.attr("name") + "']:checked").val();
                }

                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },
            getLength: function (value) {
                return value.trim().length;
            },
            format: function (source, params) {
                if (arguments.length === 1) {
                    return function () {
                        var args = $.makeArray(arguments);
                        args.unshift(source);
                        return $.validator.format.apply(this, args);
                    };
                }
                if (arguments.length > 2 && params.constructor !== Array) {
                    params = $.makeArray(arguments).slice(1);
                }
                if (params.constructor !== Array) {
                    params = [params];
                }
                $.each(params, function (i, n) {
                    source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                        return n;
                    });
                });
                return source;
            },
            submit: function (obj) {
                if (typeof obj === "function") {
                    this.submitCallback = obj;
                    this.verify(false);
                } else if (typeof obj === "string") {
                    this.submitCallback = undefined;
                    this.verifySingle(obj);
                }
                this.showMessage();
            }
        });

        this.options = $.extend(true, {}, options);
        this.init(options);
    };
})(jQuery);


