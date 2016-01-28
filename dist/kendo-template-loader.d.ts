/// <reference path="../typings/tsd.d.ts" />
declare class KendoTemplateLoader {
    templatePath: string;
    templateExtension: string;
    templateSuffix: string;
    require(...templates: any[]): JQueryPromise<void>;
    getTemplate(name: string, file?: string): JQueryPromise<string>;
    lookupTemplate(name: string): JQueryPromise<string>;
    loadTemplate(name: string, file?: string): JQueryPromise<string>;
    private resolveChildTemplates(body);
    private writeTemplate(name, body, target?);
    private getTemplateFilePath(name);
}
declare var kendoTemplateLoader: KendoTemplateLoader;
