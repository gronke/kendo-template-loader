/// <reference path="../typings/tsd.d.ts" />
declare var templatePath: string;
declare var templateExtension: string;
declare class KendoTemplateLoader {
    require(...templates: string[]): JQueryPromise<void>;
    getTemplate(name: string): JQueryPromise<string>;
    lookupTemplate(name: string): JQueryPromise<string>;
    loadTemplate(name: string): JQueryPromise<string>;
    private resolveChildTemplates(body);
    private writeTemplate(name, body, target?);
    private getTemplatePath(name);
}
declare var kendoTemplateLoader: KendoTemplateLoader;
