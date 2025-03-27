import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { VALIDATOR_ERROR_KEYS } from "./validators/validator-error-keys";

/**
 * Error state matcher for the confirm password input field.
 * It is used for being able to show an error message when the password and confirm password fields do not match.
 * 
 * @returns A boolean value that signals if an error should be shown for the confirm password input field.
 */
export class ConfirmPasswordErrorStateMatcher implements ErrorStateMatcher {
    /**
     * Checks if an error should be shown for the confirm password input field.
     */
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        // Boolean values that are needed for checking if an error should be shown
        const isTouched = !!control && control.touched;
        const isSubmitted = !!form && form.submitted;
        const isInvalid = !!control && control.invalid;
        const hasPasswordMismatchError = !!form && form.hasError(VALIDATOR_ERROR_KEYS.passwordMisMatch);

        // Return true if an error should be shown
        return (isTouched || isSubmitted) && (isInvalid || hasPasswordMismatchError);
    }
}
