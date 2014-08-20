; (function () {
    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                return i;
            }
        }
        return -1;
    }

    var selfselect = function (options) {
        $.extend(this, {
            defaults: {},
            settings: {
                allselects: document.getElementsByTagName("select"),
                newselects: [],
                ie: (document.all && window.ActiveXObject && !window.opera) ? true : false,
                createElem: function (tagName) {
                    return document.createElement(tagName);
                },
                findById: function (id) {
                    return document.getElementById(id);
                }
            },
            init: function () {
                this.selects();
                this.rselects();
            },
            selects: function () {
                for (var i = 0; i < this.settings.allselects.length; i++) {
                    this.settings.newselects[i] = this.settings.allselects[i];
                }
            },
            rselects: function () {
                var _this = this;
                var _settings = this.settings;

                for (var i = 0; i < _settings.newselects.length; i++) {
                    var select = _settings.newselects[i];
                    this.rselect(select, i);
                }
            },
            rselect: function (select, index) {
                var _this = this;
                var _settings = this.settings;

                var index = _settings.newselects.indexOf(select);
                var objExists = _settings.findById('select_' + index);
                if (objExists != null) {
                    objExists.parentNode.removeChild(objExists);
                }

                var selectTag, selectInfo, selectUl;

                select.style.display = 'none';
                selectTag = _settings.createElem('div');
                selectTag.id = 'select_' + index;
                selectTag.className = 'select-box';
                selectTag.attributes.setNamedItem(document.createAttribute("data-select-id"));
                selectTag.setAttribute("data-select-index", index);

                if (select.style.width != null && select.style.width != undefined) {
                    selectTag.style.width = select.style.width;
                }
                select.parentNode.insertBefore(selectTag, select);

                selectInfo = _settings.createElem('div');
                selectInfo.id = 'select_info_' + index;
                selectInfo.className = 'select-open static';
                selectInfo.attributes.setNamedItem(document.createAttribute("data-select-id"));
                selectInfo.setAttribute("data-select-index", index);
                selectTag.appendChild(selectInfo);

                selectUl = document.createElement('ul');
                selectUl.id = 'select_options_' + index;
                selectUl.className = 'select-options';
                selectUl.attributes.setNamedItem(document.createAttribute("data-select-id"));
                selectUl.setAttribute("data-select-index", index);
                selectUl.style.display = 'none';
                selectTag.appendChild(selectUl);

                this.roptions(select, index);
                this.mouseSelects(index);
                selectInfo.onclick = function (e) { _this.clickTag(e, this); }
            },
            roptions: function (select, index) {
                var _this = this;
                var _settings = this.settings;

                var options = select.getElementsByTagName('option');
                var selectUl = _settings.findById('select_options_' + index);
                var selectInfo = _settings.findById('select_info_' + index);

                for (var n = 0; n < select.options.length; n++) {
                    optionLi = _settings.createElem('li');
                    selectUl.appendChild(optionLi);

                    optionLi.attributes.setNamedItem(document.createAttribute("data-value"));
                    optionLi.setAttribute("data-value", select.options[n].value);

                    optionLi.attributes.setNamedItem(document.createAttribute("data-select-id"));
                    optionLi.setAttribute("data-select-index", index);

                    optionLi.appendChild(document.createTextNode(select.options[n].text));

                    var isSelected = select.options[n].selected;
                    if (isSelected) {
                        optionLi.className = 'selected';
                        optionLi.id = 'selected_' + index;

                        selectInfo.attributes.setNamedItem(document.createAttribute("data-value"));
                        selectInfo.setAttribute("data-value", select.options[n].value);
                        selectInfo.appendChild(document.createTextNode(select.options[n].text));
                    }
                    optionLi.onclick = function (e) { _this.clickOption(e, this); }
                }
            },
            mouseSelects: function (index) {
                var _this = this;
                var _settings = this.settings;
                var selectInfo = _settings.findById('select_info_' + index);
                var selectUl = _settings.findById('select_options_' + index);

                selectInfo.onmouseover = function () {
                    if (this.className == 'select-open static') { this.className = 'select-open hover'; }
                }
                selectInfo.onmouseout = function () {
                    if (selectUl.style.display == "none") {
                        if (this.className == 'select-open hover') this.className = 'select-open static';
                    }
                }

                document.onclick = function (e) { _this.hideSelects(e, this); };
            },
            clickTag: function (e, _this) {
                this.stopPropagation(e);
                var _settings = this.settings;

                var index = _this.getAttribute("data-select-index");
                var selectUl = _settings.findById('select_options_' + index);

                if (selectUl.style.display != 'none') {
                    _this.className = 'select-open static';
                    selectUl.style.display = 'none';
                }
                else {
                    _this.className = 'select-open hover';
                    selectUl.style.display = 'block';
                }

                var ul;
                for (var i = 0; i < _settings.newselects.length; i++) {
                    if (i != index) {
                        ul = _settings.findById('select_options_' + i);
                        ul.style.display = "none";
                    }
                }
            },
            clickOption: function (e, _this) {
                this.stopPropagation(e);
                var _settings = this.settings;
                var index = _this.getAttribute("data-select-index");

                var select = _settings.allselects[index];
                var selectUl = _settings.findById('select_options_' + index);
                var selectInfo = _settings.findById('select_info_' + index);

                var optionLis = document.querySelectorAll("#" + selectUl.id + " li");
                for (var i = 0; i < optionLis.length; i++) {
                    optionLis[i].className = "";
                }
                _this.className = "selected";

                selectInfo.className = 'select-open static';
                selectUl.style.display = 'none';

                selectInfo.attributes.setNamedItem(document.createAttribute("data-value"));
                selectInfo.setAttribute("data-value", _this.getAttribute("data-value"));
                selectInfo.innerHTML = "";
                selectInfo.appendChild(document.createTextNode(_this.innerHTML));

                select.value = _this.getAttribute("data-value");
                this.activeEvent(select);
            },
            hideSelects: function (e, _this) {
                if (e.target.tagName != "SELECT") {
                    var _settings = this.settings;
                    var selectUl;
                    for (var i = 0; i < _settings.newselects.length; i++) {
                        selectUl = _settings.findById('select_options_' + i);
                        selectUl.style.display = "none";
                    }
                }
            },
            stopPropagation: function (evt) {
                var e = (evt) ? evt : window.event;
                if (window.event) {
                    e.cancelBubble = true;
                } else {
                    e.stopPropagation();
                }
            },
            activeEvent: function (select) {
                if ($ != undefined) {
                    var events = $._data(select, "events");
                    if (events != undefined) {
                        if (events["blur"]) {
                            $(select).trigger("blur");
                        }
                        if (events["change"]) {
                            $(select).trigger("change");
                        }
                    }
                }

                if (select.onchange != null) {
                    select.onchange();
                }
                if (select.onblur != null) {
                    select.onblur();
                }
            },
            restart: function (id) {
                this.rselect(this.settings.findById(id));
            }
        });

        this.options = $.extend(true, {}, options);
        this.init(options);
    };

    window.onload = function () {
        window.SelfSelect = new selfselect();
    }
})();
