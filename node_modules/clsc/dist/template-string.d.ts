export declare type TemplateArgs<P = {}> = string | ((props: P) => string);
interface IProcessTemplateString<P = {}> {
    template: TemplateStringsArray;
    args: TemplateArgs[];
    props: P;
}
export declare const processTemplateString: ({ template, args, props, }: IProcessTemplateString) => string;
export {};
