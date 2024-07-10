import NotionPropertyParser from '../NotionPropertyParser';

export default class NotionMultiSelectParser extends NotionPropertyParser<string[]> {
    constructor(property: any) {
        super(property, 'multi_select');
    }
    protected parseProperty(): string[] {
        return this.propertyFieldObject.map((option: any) => option.name);
    }
}
