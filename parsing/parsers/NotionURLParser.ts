import NotionPropertyParser from '../NotionPropertyParser';

export default class NotionURLParser extends NotionPropertyParser<string> {
    constructor(property: any) {
        super(property, 'url');
    }
    protected parseProperty(): string {
        const url = this.propertyFieldObject;
        return url;
    }
}
