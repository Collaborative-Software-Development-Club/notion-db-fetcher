import NotionParsingError from '../errors/ParsingError';

export default abstract class NotionPropertyParser<ParsedPropertyType> {
    protected propertyFieldObject: any;
    constructor(property: any, propertyField: string) {
        this.propertyFieldObject = property[propertyField];
    }
    public parse(): ParsedPropertyType | undefined {
        if (this.propertyIsMissing()) {
            return undefined;
        }
        const propertyFieldObject = this.propertyFieldObject;
        try {
            return this.parseProperty();
        } catch (error: any) {
            throw new NotionParsingError(propertyFieldObject, error.toString());
        }
    }
    private propertyIsMissing(): boolean {
        return this.propertyFieldObject == null;
    }
    protected abstract parseProperty(): ParsedPropertyType;
}
