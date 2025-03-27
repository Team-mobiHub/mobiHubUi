import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { VALIDATOR_ERROR_KEYS } from "./validator-error-keys";

/**
 * Validator function to check if a new password and its confirmation input field match.
 * 
 * @param passwordField The name of the password field in the form group.
 * @param confirmPasswordField The name of the confirm password field in the form group.
 * @returns A `ValidatorFn` that returns a validation error object with the key `passwordMisMatch`.
 */
export function passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const formGroup = control as FormGroup;
        const passwordValue = formGroup.controls[passwordField].value;
        const confirmPasswordValue = formGroup.controls[confirmPasswordField].value;

        // If the password or confirmPassword value is empty,
        // return null (This validator should not check empty password fields)
        if (!passwordValue || !confirmPasswordValue) {
            return null;
        }

        // Check if the password and confirmPassword values do not match,
        // and if yes, return an error
        if (passwordValue !== confirmPasswordValue) {
            return { [VALIDATOR_ERROR_KEYS.passwordMisMatch]: true };
        }

        // If the password and confirmPassword values match, return null (No error)
        return null;
    };
}
