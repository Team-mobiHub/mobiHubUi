
/**
 * Data Transfer Object (DTO) for the Identity abstraction that can represent either a user or a team.
 */
export interface IdentityDto {
    /**
     * The unique identifier of the identity. This field is optional.
     */
    id: number | null;

    /**
     * The name of the identity.
     */
    name: string;

    /**
     * The email address of the identity.
     */
    email: string;

    /**
     * The profile picture represented as a byte array. Can be null.
     */
    profilePicture: number[] | null; // ByteArray of Bytes

    /**
     * The link to the profile picture.
     */
    profilePictureLink: string;
}
