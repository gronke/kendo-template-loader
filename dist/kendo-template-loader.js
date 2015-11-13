/// <reference path="../typings/tsd.d.ts" />
'use strict';
var templatePath = 'fixtures/templates';
var templateExtension = 'html';
var KendoTemplateLoader = (function () {
    function KendoTemplateLoader() {
    }
    KendoTemplateLoader.prototype.require = function () {
        var templates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            templates[_i - 0] = arguments[_i];
        }
        return $.Deferred(function (promise) {
            $.when.apply(null, $.map(templates, this.getTemplate))
                .all(promise.resolve);
        });
    };
    KendoTemplateLoader.prototype.getTemplate = function (name) {
        var that = this;
        var dfd = $.Deferred();
        $.when(that.lookupTemplate(name))
            .done(function () {
            dfd.resolve();
        })
            .fail(function () {
            $.when(that.loadTemplate(name))
                .then(dfd.resolve)
                .fail(dfd.reject);
        });
        return dfd;
    };
    KendoTemplateLoader.prototype.lookupTemplate = function (name) {
        var templateScriptElement = $('#' + name);
        var dfd = $.Deferred();
        if (templateScriptElement.length) {
            dfd.resolve(templateScriptElement.html());
        }
        else {
            dfd.reject();
        }
        return dfd;
    };
    KendoTemplateLoader.prototype.loadTemplate = function (name) {
        return $.get(this.getTemplatePath(name));
    };
    KendoTemplateLoader.prototype.getTemplatePath = function (name) {
        return templatePath + '/' + name + '.' + templateExtension;
    };
    return KendoTemplateLoader;
})();
