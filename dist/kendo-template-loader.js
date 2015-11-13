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
        var templateScriptElement = $('script[type="text/x-kendo-template"][name="' + name + '"]');
        var dfd = $.Deferred();
        if (templateScriptElement.length) {
            dfd.resolve(templateScriptElement.text());
        }
        else {
            dfd.reject();
        }
        return dfd;
    };
    KendoTemplateLoader.prototype.loadTemplate = function (name) {
        var that = this;
        var dfd = $.Deferred();
        $.get(this.getTemplatePath(name))
            .then(function (data) {
            data = data.trim();
            that.writeTemplate(name, data);
            dfd.resolve(data);
        })
            .fail(function (e) {
            dfd.reject(e);
        });
        return dfd;
    };
    KendoTemplateLoader.prototype.writeTemplate = function (name, body, target) {
        var $target = $(target || 'body');
        var el = document.createElement('script');
        el.type = 'text/x-kendo-template';
        el.text = body;
        el.setAttribute('name', name);
        $target.append(el);
    };
    KendoTemplateLoader.prototype.getTemplatePath = function (name) {
        return templatePath + '/' + name + '.' + templateExtension;
    };
    return KendoTemplateLoader;
})();
var kendoTemplateLoader = new KendoTemplateLoader();