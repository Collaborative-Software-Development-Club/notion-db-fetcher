export default class MissingPropertyValueError extends Error {
    constructor(propertyName: string) {
        super(`Missing value for property "${propertyName}" on Notion database.`);
    }
}
