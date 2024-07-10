import NotionPropertyParser from '../NotionPropertyParser';

export default class NotionRichTextParser extends NotionPropertyParser<string> {
    constructor(property: any) {
        super(property, 'rich_text');
    }
    protected parseProperty(): string {
        return this.propertyFieldObject.reduce(
            (finalText: any, text: any) => finalText + text.plain_text,
            '',
        );
    }
}
