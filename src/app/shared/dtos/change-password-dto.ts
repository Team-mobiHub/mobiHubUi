/**
 * Interface representing the data transfer object for changing the user's password.
 */
export interface ChangePasswordDto {
    /** The old password entered by the user */
    oldPassword: String,
    
    /** The new password entered by the user */
    newPassword: String
}
