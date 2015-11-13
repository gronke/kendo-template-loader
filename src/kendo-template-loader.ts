/// <reference path="../typings/tsd.d.ts" />
'use strict';

var templatePath = 'fixtures/templates';
var templateExtension = 'html';

class KendoTemplateLoader {

	require(...templates: string[]): JQueryPromise<void> {
		return $.Deferred(function(promise: JQueryDeferred<void>) {
			$.when.apply(null, $.map(templates, this.getTemplate))
				.all(promise.resolve);
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

	private lookupTemplate(name: string): JQueryPromise<string> {
		
		var templateScriptElement: JQuery = $('script[type="text/x-kendo-template"][name="' + name + '"]');
		var dfd = $.Deferred();

		if (templateScriptElement.length) {
			dfd.resolve(templateScriptElement.text());
		} else {
			dfd.reject();
		}

		return dfd;

	}

	private loadTemplate(name: string): JQueryPromise<string> {
		
		var that = this;
		var dfd = $.Deferred();

		$.get(this.getTemplatePath(name))
		.then(function(data: string) {
			data = data.trim();
			that.writeTemplate(name, data);
			dfd.resolve(data);
		})
		.fail(function(e) {
			dfd.reject(e);
		});

		return dfd;

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

	private getTemplatePath(name: string): string {
		return templatePath + '/' + name + '.' + templateExtension;
	}

}

var kendoTemplateLoader: KendoTemplateLoader = new KendoTemplateLoader();
