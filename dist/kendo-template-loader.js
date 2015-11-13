/// <reference path="../typings/tsd.d.ts" />
'use strict';
var templatePath = 'fixtures/templates';
var templateExtension = 'html';
var KendoTemplateLoader = (function () {
    function KendoTemplateLoader() {
    }
    KendoTemplateLoader.prototype.require = function () {
        var _this = this;
        var templates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            templates[_i - 0] = arguments[_i];
        }
        return $.Deferred(function (promise) {
            var templatePromises = $.map(templates, function (template) {
                return _this.getTemplate(template);
            });
            $.when.apply($, templatePromises)
                .done(promise.resolve);
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
            that.resolveChildTemplates(data)
                .then(function () {
                dfd.resolve(data);
            });
        })
            .fail(function (e) {
            dfd.reject(e);
        });
        return dfd;
    };
    KendoTemplateLoader.prototype.resolveChildTemplates = function (body) {
        var _this = this;
        var dataTemplateRegex = /\bdata-template=["'](.+?)["']/gi;
        var matches = body.match(dataTemplateRegex);
        if (matches === null) {
            return $.Deferred().resolve().promise();
        }
        var promises = $.map(matches, function (match) {
            match.match(dataTemplateRegex)[1];
            return _this.getTemplate(RegExp.$1);
        });
        return $.Deferred(function (promise) {
            $.when.apply($, promises).done(function () {
                promise.resolve();
            });
        });
    };
    KendoTemplateLoader.prototype.writeTemplate = function (name, body, target) {
        var $target = $(target || 'body');
        var el = document.createElement('script');
        el.type = 'text/x-kendo-template';
        el.text = body;
        el.setAttribute('name', name);
        el.setAttribute('id', name);
        $target.append(el);
    };
    KendoTemplateLoader.prototype.getTemplatePath = function (name) {
        return templatePath + '/' + name + '.' + templateExtension;
    };
    return KendoTemplateLoader;
})();
var kendoTemplateLoader = new KendoTemplateLoader();
