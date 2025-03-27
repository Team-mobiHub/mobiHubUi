/**
 * Interface representing the data transfer object for ratings.
 * It stores relevant information about the rating of a traffic model.
 */
export interface RatingDto {
    /**
     * The ID of the traffic model that the rating is for.
     */
    trafficModelId: number;

    /**
     * The rating given by the user (a number ranging from 1 to 5).
     */
    usersRating: number;

    /**
     * The average rating of the traffic model.
     */
    averageRating: number;
}
