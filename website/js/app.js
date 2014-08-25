﻿/*******************
*** Application  ***
*******************/
window.App = Ember.Application.create({
    name: "application",
    getView: function (name) {
        var template = '';
        $.ajax(
            {
                url: '/templates/' + name + '.html',
                async: false,
                success: function (text) {
                    template = text;
                }
            });
        return Ember.Handlebars.compile(template);
    }
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();

/*******************
***     View    ***
*******************/
App.ApplicationView = Ember.View.extend({
    template: App.getView('application'),
    templateName: "application"
});


/*******************
***   Control    ***
*******************/
App.ApplicationController = Ember.ObjectController.extend({
    userName: "Wenxiang",
    actions: {
        logout: function () {
            alert("logout");
        },
        exit: function () { alert("Exit"); }
    }
});