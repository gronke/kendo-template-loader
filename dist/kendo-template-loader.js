/// <reference path="../typings/tsd.d.ts" />
'use strict';
var KendoTemplateLoader = (function () {
    function KendoTemplateLoader() {
        this.templatePath = 'fixtures/templates';
        this.templateExtension = 'html';
        this.templateSuffix = '-template';
    }
    KendoTemplateLoader.prototype.require = function () {
        var _this = this;
        var templates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            templates[_i - 0] = arguments[_i];
        }
        return $.Deferred(function (promise) {
            var templatePromises = $.map(templates, function (template) {
                if (typeof (template) === 'string') {
                    return _this.getTemplate(template);
                }
                else {
                    return _this.getTemplate(template.name, template.file);
                }
            });
            $.when.apply($, templatePromises)
                .done(promise.resolve);
        });
    };
    KendoTemplateLoader.prototype.getTemplate = function (name, file) {
        file = file || name;
        var that = this;
        var dfd = $.Deferred();
        $.when(that.lookupTemplate(name))
            .done(function () {
            dfd.resolve();
        })
            .fail(function () {
            $.when(that.loadTemplate(name, file))
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
    KendoTemplateLoader.prototype.loadTemplate = function (name, file) {
        file = file || name;
        file = file.split('--').join('/');
        var that = this;
        var dfd = $.Deferred();
        $.ajax({
            url: this.getTemplateFilePath(file),
            dataType: 'html'
        })
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
        var dataTemplateRegex = /\bdata-(?:[A-z0-9]+\-)*template=["'](.+?)["']/gi;
        var match, promises = [];
        while (match = dataTemplateRegex.exec(body)) {
            var dependencyName = match[1];
            var suffixMatchPosition = dependencyName.indexOf(this.templateSuffix);
            if ((suffixMatchPosition !== -1) && ((suffixMatchPosition + this.templateSuffix.length) === dependencyName.length)) {
                dependencyName = dependencyName.substr(0, suffixMatchPosition);
            }
            promises.push(this.getTemplate(dependencyName));
        }
        return $.when.apply($, promises);
    };
    KendoTemplateLoader.prototype.writeTemplate = function (name, body, target) {
        var $target = $(target || 'body');
        var el = document.createElement('script');
        el.type = 'text/x-kendo-template';
        el.text = body;
        el.setAttribute('name', name);
        el.setAttribute('id', name + this.templateSuffix);
        $target.append(el);
    };
    KendoTemplateLoader.prototype.getTemplateFilePath = function (name) {
        return this.templatePath + '/' + name + '.' + this.templateExtension;
    };
    return KendoTemplateLoader;
})();
var kendoTemplateLoader = new KendoTemplateLoader();
