/**
 * Interface representing the data transfer object for a search result item.
 * A search result item represents a single traffic model in the search results.
 */
export interface SearchResultItemDto {
    /**
     * The ID of the traffic model.
     */
    trafficModelId: number;

    /**
     * The name of the traffic model.
     */
    name: string;

    /**
     * The description of the traffic model.
     */
    description: string;

    /**
     * The average rating of the traffic model.
     */
    averageRating: number;

    /**
     * The image URL of the traffic model.
     */
    imageURL: string;
}
