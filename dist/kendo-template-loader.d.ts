/// <reference path="../typings/tsd.d.ts" />
declare class KendoTemplateLoader {
    templatePath: string;
    templateExtension: string;
    templateSuffix: string;
    require(...templates: string[]): JQueryPromise<void>;
    getTemplate(name: string): JQueryPromise<string>;
    lookupTemplate(name: string): JQueryPromise<string>;
    loadTemplate(name: string): JQueryPromise<string>;
    private resolveChildTemplates(body);
    private writeTemplate(name, body, target?);
    private getTemplateFilePath(name);
}
declare var kendoTemplateLoader: KendoTemplateLoader;
