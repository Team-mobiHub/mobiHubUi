/**
 * Interface representing the data transfer object for user registration.
 * It is used to store the data needed to register a new user.
 */
export interface RegisterDto {
    /**
     * The username with which the user wants to register.
     */
    username: string;

    /**
     * The email address with which the user wants to register.
     */
    email: string;

    /**
     * The password with which the user wants to register.
     */
    password: string;
}
