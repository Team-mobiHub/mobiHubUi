import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { VALIDATOR_ERROR_KEYS } from "./validator-error-keys";

/**
 * Validator function to check if the control's value meets the password complexity requirements.
 * 
 * @returns A `ValidatorFn` that returns a validation error object with the possible
 *          keys `missingUpperCase`, `missingLowerCase`, and `missingSpecialCharacter`.
 */
export function passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordValue = control.value;  // The password value entered by the user

      // If the password value is empty, return null (This validator should not check empty passwords)
      if (!passwordValue) {
        return null;
      }
  
      const hasUpperCase = /[A-Z]/.test(passwordValue);
      const hasLowerCase = /[a-z]/.test(passwordValue);
      const hasSpecialCharacter = /[^A-Za-z0-9]/.test(passwordValue);
  
      // If the password value does not meet the complexity requirements, return an object with the errors to show them to the user
      const errors: ValidationErrors = {};
      if (!hasUpperCase) {
        errors[VALIDATOR_ERROR_KEYS.missingUpperCase] = true;
      }
      if (!hasLowerCase) {
        errors[VALIDATOR_ERROR_KEYS.missingLowerCase] = true;
      }
      if (!hasSpecialCharacter) {
        errors[VALIDATOR_ERROR_KEYS.missingSpecialCharacter] = true;
      }
  
      return Object.keys(errors).length ? errors : null;
    };
}
