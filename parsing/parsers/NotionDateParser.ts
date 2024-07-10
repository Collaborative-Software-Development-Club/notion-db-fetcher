import NotionPropertyParser from '../NotionPropertyParser';

export default class NotionDateParser extends NotionPropertyParser<Date | [Date, Date]> {
    constructor(property: any) {
        super(property, 'date');
    }
    protected parseProperty(): Date | [Date, Date] {
        const datePropertyField = this.propertyFieldObject;
        if (datePropertyField.end) {
            return [new Date(datePropertyField.start), new Date(datePropertyField.end)];
        }
        return new Date(datePropertyField.start);
    }
}
