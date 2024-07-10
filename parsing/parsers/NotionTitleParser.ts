import NotionPropertyParser from '../NotionPropertyParser';

export default class NotionTitleParser extends NotionPropertyParser<string> {
    constructor(property: any) {
        super(property, 'title');
    }
    protected parseProperty(): string {
        return this.propertyFieldObject.reduce(
            (finalText: any, text: any) => finalText + text.plain_text,
            '',
        );
    }
}
