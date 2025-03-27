import { CommentDto } from "./comment-dto";
import { RatingDto } from "./rating-dto";
import { Framework } from "../enums/framework";
import { CharacteristicDTO } from "./characteristic-dto";

/**
 * Interface representing the data transfer object for a traffic model.
 */
export interface TrafficModelDto {
    /**
     * The ID of the traffic model.
     */
    id: number;

    /**
     * The name of the traffic model.
     */
    name: string;

    /**
     * The description of the traffic model.
     */
    description: string;

    /**
     * The ID of the user who is the author of the traffic model.
     * Optional, because the author of the traffic model can be a team.
     */
    userId?: number;

    /**
     * The ID of the team that is the author of the traffic model.
     * Optional, because the author of the traffic model can be a user.
     */
    teamId?: number;

    /**
     * Stores whether the traffic model is public or private.
     */
    isVisibilityPublic: boolean;
    
    /**
     * The URL of the data source of the traffic model.
     */
    dataSourceUrl: string;

    /**
     * The characteristics of the traffic model.
     */
    characteristics: CharacteristicDTO[];

    /**
     * The framework of the traffic model.
     */
    framework: Framework;

    /**
     * The region of the traffic model.
     */
    region: string;

    /**
     * The coordinates of the traffic model.
     * Optional, because the traffic model can have no coordinates.
     */
    coordinates: string | null;

    /**
     * The URLs of the images of the traffic model.
     */
    imageURLs: string[];

    /**
     * The URL of the markdown file of the traffic model.
     */
    markdownFileURL: string;

    /**
     * Stores whether the traffic model is a favorite of the user.
     */
    isFavorite: boolean;

    /**
     * The token of the zip file of the traffic model.
     */
    zipFileToken: string;

    /**
     * A RatingDto object representing rating data of the traffic model.
     */
    rating: RatingDto;

    /**
     * An array of CommentDto objects representing comments of the traffic model.
     */
    comments: CommentDto[];
}
