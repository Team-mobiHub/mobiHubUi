import { IdentityDto } from "./identity-dto";
import { UserDto } from "./user-dto";

/**
 * Represents a Data Transfer Object (DTO) for a team.
 */
export interface TeamDto extends IdentityDto {
    /**
     * The description of the team.
     */
    description: string;

    /**
     * The ID of the user who owns the team.
     */
    ownerUserId: number;

    /**
     * The username of the user who owns the team.
     */
    ownerUserName: string;

    /**
     * The link to the profile picture of the team.
     */
    profilePictureLink: string;

    /**
     * The owner of the team.
     */
    owner: UserDto;

    /**
     * The members of the team.
     */
    members: UserDto[];
}
