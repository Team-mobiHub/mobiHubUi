import { IdentityDto } from "./identity-dto";
import { TeamDto } from "./team-dto";

/**
 * Interface representing the data transfer object for a user.
 */
export interface UserDto extends IdentityDto {
    /**
     * Stores whether the email address of the user is verified.
     */
    isEmailVerified: boolean;

    /**
     * The link to the profile picture of the user.
     */
    profilePictureLink: string;

    /**
     * Stores whether the user is an administrator.
     */
    isAdmin: boolean;


    /**
     * The teams the user is a member of.
     */
    teams: TeamDto[];
}
