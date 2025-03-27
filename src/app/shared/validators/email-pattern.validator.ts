import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATOR_ERROR_KEYS } from './validator-error-keys';

// A regular expression to check an email address entered by the user
const EMAIL_REGEX =
    "^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]|[\\w-]{2,}))@" +
    "((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?" +
    "[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\." +
    "([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9]))|" +
    "([a-zA-Z]+[\\w-]+\\.)+[a-zA-Z]{2,4})$";

/**
 * Validator function to check if the control's value matches the email regex, except if the email is an empty string
 * 
 * @returns A `ValidatorFn` that returns a validation error object with the key `emailPattern`
 * if the control's value does not match the email pattern, or `null` if it does.
 */
export function emailPatternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const emailValue = control.value;
        if (emailValue && !new RegExp(EMAIL_REGEX).test(emailValue)) {
            return { [ VALIDATOR_ERROR_KEYS.emailPattern ]: true };
        }
        return null;
    };
}
