/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../..//src/kendo-template-loader.ts" />

class KendoTemplateLoaderMock extends KendoTemplateLoader {

	mockStats: {
		getTemplateCalls: number;
		lookupTemplateCalls: number;
		loadTemplateCalls: number;
	} = {
		getTemplateCalls: 0,
		lookupTemplateCalls: 0,
		loadTemplateCalls: 0
	};

	getTemplate(name: string): JQueryPromise<string> {
		this.mockStats.getTemplateCalls++;
		return super.getTemplate(name);
	}

	lookupTemplate(name: string): JQueryPromise<string> {
		this.mockStats.lookupTemplateCalls++;
		return super.lookupTemplate(name);
	}

	loadTemplate(name: string): JQueryPromise<string> {
		this.mockStats.loadTemplateCalls++;
		return super.loadTemplate(name);
	}

}
