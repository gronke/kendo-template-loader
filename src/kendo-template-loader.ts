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

		var templateScriptElement = $('#' + name);
		var dfd = $.Deferred();

		if (templateScriptElement.length) {
			dfd.resolve(templateScriptElement.html());
		} else {
			dfd.reject();
		}

		return dfd;

	}

	private loadTemplate(name: string): JQueryPromise<string> {
		return $.get(this.getTemplatePath(name));
	}

	private getTemplatePath(name: string): string {
		return templatePath + '/' + name + '.' + templateExtension;
	}

}
