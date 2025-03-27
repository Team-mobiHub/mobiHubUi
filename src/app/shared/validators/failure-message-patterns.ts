/**
 * Regular expressions for checking the server response in case of a registration error
 */
export const FAILURE_MESSAGE_PATTERNS = {
    EMAIL_IN_USE_REGEX: /User by email .* already found\./,
    EMAIL_DOES_NOT_EXIST_REGEX: /User by email .* not found\./,
    USERNAME_IN_USE_REGEX: /User by name .* already found\./,
    INVALID_PASSWORD_REGEX: /Invalid password/,
    UPLOADED_PROFILE_PICTURE_TOO_LARGE_REGEX: /Profile picture size exceeds (\d+) Bytes\./
};
