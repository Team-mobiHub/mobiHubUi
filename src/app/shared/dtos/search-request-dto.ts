import { Framework } from "../enums/framework";
import { ModelLevel } from "../enums/model-level";
import { ModelMethod } from "../enums/model-method";

/**
 * Interface representing the data transfer object for search requests.
 */
export interface SearchRequestDto {
    /**
     * The page number of the search results.
     */
    page: number;

    /**
     * The number of traffic models displayed on a single search result page.
     */
    pageSize: number;

    /**
     * Optional search query for searching traffic models by name.
     */
    name: string | null;

    /**
     * Optional search query for searching traffic models by author name.
     */
    authorName: string | null;

    /**
     * Optional search query for searching traffic models by region.
     */
    region: string | null;

    /**
     * Optional search query for searching traffic models by model levels.
     */
    modelLevels: ModelLevel[];

    /**
     * Optional search query for searching traffic models by model methods.
     */
    modelMethods: ModelMethod[];

    /**
     * Optional search query for searching traffic models by frameworks.
     */
    frameworks: Framework[];
}
