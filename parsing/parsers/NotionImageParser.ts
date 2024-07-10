import NotionPropertyParser from '../NotionPropertyParser';

export default class NotionImageParser extends NotionPropertyParser<string> {
    constructor(property: any) {
        super(property, 'files');
    }
    protected parseProperty(): string {
        const url = this.propertyFieldObject[0].file.url;
        return url;
    }
}
