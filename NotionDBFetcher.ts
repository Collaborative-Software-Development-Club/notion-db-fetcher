import { Client, isFullPage } from "@notionhq/client";
import {
	DatabaseObjectResponse,
	PageObjectResponse,
	PartialDatabaseObjectResponse,
	PartialPageObjectResponse,
	QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import NotionPropertyParserFactory from "./parsing/NotionPropertyParserFactory";
import MissingPropertyValueError from "./errors/MissingPropertyValueError";
import MissingPropertyError from "./errors/MissingPropertyError";
import NotionAPIError from "./errors/NotionAPIError";

type NotionDBMapping<T> = Record<
	keyof T,
	string | { name: string; mandatory: boolean }
>;

export default class NotionDBFetcher<T> {
	private parserFactory: NotionPropertyParserFactory =
		new NotionPropertyParserFactory();
	constructor(
		private databaseId: string,
		private notionClient: Client,
		private mapping: NotionDBMapping<T>
	) {}
	public async get(options?: {
		filter?: any;
		sorts?: any[];
		pageSize?: number;
	}): Promise<T[]> {
		const response = await this.fetch(options);
		return this.parseResponse(response);
	}
	private async fetch(options?: {
		filter?: any;
		sorts?: any[];
		pageSize?: number;
	}): Promise<QueryDatabaseResponse> {
		try {
			const response = await this.notionClient.databases.query({
				database_id: this.databaseId,
				filter: options?.filter,
				sorts: options?.sorts,
				page_size: options?.pageSize,
			});
			return response;
		} catch (error: any) {
			throw new NotionAPIError(error.toString());
		}
	}
	public parseResponse(response: QueryDatabaseResponse): T[] {
		const results = response.results;
		this.assertResultsAreFullPages(results);
		const items = results.map(result => {
			const properties = result.properties;
			return this.parsePageProperties(properties);
		});
		return items;
	}
	private parsePageProperties(properties: any): T {
		const values: Record<string, unknown> = {};
		for (const key in this.mapping) {
			const value = this.mapping[key];
			const propertyName = this.getPropertyName(value);
			const propertyIsMandatory = this.checkIfPropertyIsMandatory(value);
			if (!(propertyName in properties)) {
				throw new MissingPropertyError(propertyName);
			}
			const propertyValue = this.parserFactory
				.getPropertyParser(properties[propertyName])
				.parse();
			if (propertyIsMandatory) {
				this.assertPropertyValueIsMissing(propertyValue, propertyName);
			}
			values[key] = propertyValue;
		}
		return values as T;
	}
	private getPropertyName(
		mappingValue: string | { name: string; mandatory: boolean }
	) {
		if (typeof mappingValue === "string") {
			return mappingValue;
		} else {
			return mappingValue.name;
		}
	}
	private checkIfPropertyIsMandatory(
		mappingValue: string | { name: string; mandatory: boolean }
	) {
		if (typeof mappingValue === "string") {
			return true;
		}
		return mappingValue.mandatory;
	}
	private assertResultsAreFullPages(
		results: (
			| PageObjectResponse
			| PartialPageObjectResponse
			| PartialDatabaseObjectResponse
			| DatabaseObjectResponse
		)[]
	): asserts results is PageObjectResponse[] {
		results.forEach(result => {
			if (!isFullPage(result)) {
				throw new NotionAPIError(
					`Result ${JSON.stringify(result)} is not a full page object`
				);
			}
		});
	}
	private assertPropertyValueIsMissing<T>(
		parsedProperty: T,
		propertyName: string
	): asserts parsedProperty is NonNullable<T> {
		if (parsedProperty === undefined) {
			throw new MissingPropertyValueError(propertyName);
		}
	}
}
