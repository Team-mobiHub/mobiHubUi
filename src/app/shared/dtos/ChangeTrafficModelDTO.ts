import { Framework } from "../enums/framework";
import { FileStatusDTO } from "./file-status-dto";
import { CharacteristicDTO } from "./characteristic-dto";

/**
 * Interface representing the data transfer object for creating a traffic model.
 */
export interface ChangeTrafficModelDTO {
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
     */
    ownerUserId: number | null;

    /**
     * The id of the owner team.
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
     */
    coordinates: string | null;

    /**
     * Whether the zip file has changed.
     */
    hasZipFileChanged: boolean;

    /**
     * The changed images.
     */
    changedImages: FileStatusDTO[];
}
