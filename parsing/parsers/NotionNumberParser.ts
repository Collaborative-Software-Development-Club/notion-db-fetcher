import NotionPropertyParser from '../NotionPropertyParser';

export default class NotionNumberParser extends NotionPropertyParser<number> {
    constructor(property: any) {
        super(property, 'number');
    }
    protected parseProperty(): number {
        const number = this.propertyFieldObject;
        return number;
    }
}
