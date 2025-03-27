import { Framework } from "../enums/framework";
import { ModelLevel } from "../enums/model-level";
import { ModelMethod } from "../enums/model-method";

/**
 * Interface representing the data transfer object for creating a traffic model.
 */
export interface CreateTrafficModelResponseDTO {
    /**
     * The id of the traffic model.
     */
    id: number | null;

    /**
     * The name of the traffic model.
     */
    name: string;

    /**
     * The description of the traffic model.
     */
    description: string;

    /**
     * The id of the owner user.
     * Optional because the owner can be a team.
     */
    ownerUserId: number | null;

    /**
     * The id of the owner team.
     * Optional because the owner can be a user.
     */
    ownerTeamId: number | null;

    /**
     * Whether the traffic model is public.
     */
    isVisibilityPublic: boolean;

    /**
     * The URL of the data source.
     */
    dataSourceUrl: string;

    /**
     * The characteristics of the traffic model.
     */
    characteristics: [ModelLevel, ModelMethod][];

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
     */
    coordinates: string | null;

    /**
     * The token of the zip file.
     */
    zipFileToken: string;

    /**
     * The tokens of the images.
     */
    imageTokens: string[];
}
