/**
 * Interface for the AuthResponseDTO
 */
export interface AuthResponseDTO {
    /**
     * The token that is returned by the server.
     */
    token: string;

    /**
     * The expiration date of the token.
     */
    expiresAt: Date;
}
