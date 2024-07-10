export default class MissingPropertyError extends Error {
    constructor(propertyName: string) {
        super(`Property "${propertyName}" does not exist on Notion database.`);
    }
}
