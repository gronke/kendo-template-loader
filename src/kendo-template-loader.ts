/// <reference path="../typings/tsd.d.ts" />
'use strict';

var templatePath: string = 'fixtures/templates';
var templateExtension: string = 'html';

class KendoTemplateLoader {

	templatePath: string = templatePath;

	require(...templates: string[]): JQueryPromise<void> {
        return $.Deferred((promise: JQueryDeferred<void>) => {
            var templatePromises = $.map(templates, (template: string) => {
                return this.getTemplate(template)
            });
            $.when.apply($, templatePromises)
				.done(promise.resolve);
		});
	}

	getTemplate(name: string): JQueryPromise<string> {

		var that = this;
		var dfd = $.Deferred();

		$.when(that.lookupTemplate(name))
			.done(function() {
				dfd.resolve();
			})
			.fail(function() {

				$.when(that.loadTemplate(name))
					.then(dfd.resolve)
					.fail(dfd.reject);

			});

		return dfd;

	}

	lookupTemplate(name: string): JQueryPromise<string> {
		
		var templateScriptElement: JQuery = $('script[type="text/x-kendo-template"][name="' + name + '"]');
		var dfd = $.Deferred();

		if (templateScriptElement.length) {
			dfd.resolve(templateScriptElement.text());
		} else {
			dfd.reject();
		}

		return dfd;

	}

	loadTemplate(name: string): JQueryPromise<string> {
		
		var that = this;
		var dfd = $.Deferred();

		$.get(this.getTemplateFilePath(name))
		.then(function(data: string) {
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

    }

    private resolveChildTemplates(body: string): JQueryPromise<void> {
        var dataTemplateRegex: RegExp = /\bdata-template=["'](.+?)["']/gi;
        var match, promises = [];
        while(match = dataTemplateRegex.exec(body)) {
			promises.push(this.getTemplate(match[1]));
        }
        return $.when.apply($, promises);
    }

	private writeTemplate(name: string, body: string, target?: JQuery | string) {
		var $target: JQuery = $(target || 'body');
		var el: HTMLScriptElement = document.createElement('script');
		el.type = 'text/x-kendo-template';
		el.text = body;
		el.setAttribute('name', name);
        el.setAttribute('id', name);
		$target.append(el);
	}

	private getTemplateFilePath(name: string): string {
		return this.templatePath + '/' + name + '.' + templateExtension;
	}

}

var kendoTemplateLoader: KendoTemplateLoader = new KendoTemplateLoader();
