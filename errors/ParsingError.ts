export default class NotionParsingError extends Error {
    constructor(property: any, description: string) {
        super(`Error parsing property: ${JSON.stringify(property)}\, ${description}`);
    }
}
