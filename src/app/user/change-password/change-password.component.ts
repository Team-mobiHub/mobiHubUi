import { Component } from '@angular/core';
import { DATA_CONSTANTS } from '../../shared/validators/data-constants';
import { FAILURE_MESSAGE_PATTERNS } from '../../shared/validators/failure-message-patterns';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordComplexityValidator } from '../../shared/validators/password-requirements.validator';
import { UserService } from '../../shared/services/user.service';
import { ConfirmPasswordErrorStateMatcher } from '../../shared/confirm-password-error-state-matcher';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { VALIDATOR_ERROR_KEYS } from '../../shared/validators/validator-error-keys';

/**
 * Component responsible for the change password page of the application.
 */
@Component({
  selector: 'mh-change-password',
  standalone: false,

  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss', '../auth-form/auth-shared-styles.scss']
})
export class ChangePasswordComponent {
  private failureMessagePatterns = FAILURE_MESSAGE_PATTERNS;

  /**
   * Constants for the data validation of the user input fields.
   * E.g. minimum and maximum length of a user password.
   */
  dataConstants = DATA_CONSTANTS;

  /**
   * Error state matcher for the confirm password input field.
   * It is used for being able to show an error message when the password and confirm password fields do not match.
   */
  confirmPasswordMatcher = new ConfirmPasswordErrorStateMatcher();

  /**
   * Keys for the error messages of the form fields.
   */
  validatorErrorKeys = VALIDATOR_ERROR_KEYS;

  /**
   * Signals if the form is currently being submitted, e.g. to show a loading spinner
   */
  isChangePasswordFormLoading: boolean = false;

  /**
   * Used to show an error message if the login did not work and it's not clear, why
   */
  fatalChangePasswordError: boolean = false;

  /**
   * Used to show a message to the user if the password change was successful.
   */
  isPasswordChangeComplete: boolean = false;

  /**
   * Form group for the change password form.
   */
  changePasswordForm = new FormGroup({
    currentPassword: new FormControl(
      '',
      Validators.required
    ),
    newPassword: new FormControl(
      '',
      [
        Validators.required,
        passwordComplexityValidator(),
        Validators.minLength(this.dataConstants.MINIMUM_PASSWORD_LENGTH),
        Validators.maxLength(this.dataConstants.MAXIMUM_PASSWORD_LENGTH)
      ]
    ),
    confirmPassword: new FormControl(
      '',
      Validators.required
    )
  },
  {
    validators: passwordMatchValidator('newPassword', 'confirmPassword')
  });

  constructor(private userService: UserService) {

  }

  /**
   * Method to submit the change password form.
   */
  onSubmit() {
    // Hide the error message if the user tries to change his password again
    this.fatalChangePasswordError = false;

    // Check if the user has entered valid data in the input fields
    if (this.changePasswordForm.invalid) {
      return;
    }

    // Disable the form and signal that the form is loading while the password is being changed,
    // e.g. to show a loading spinner
    this.changePasswordForm.disable();
    this.isChangePasswordFormLoading = true;

    // Call the user service to change the password
    const oldPassword = this.changePasswordForm.value.currentPassword ?? '';
    const newPassword = this.changePasswordForm.value.newPassword ?? '';
    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        // Show a success message if the password was successfully changed
        this.isPasswordChangeComplete = true;
        console.warn('Password change successful');
      },
      error: err => {
        // Enable the form again for the user to try again
        this.changePasswordForm.enable();
        this.isChangePasswordFormLoading = false;

        // Check if the cause of the error is known
        if (err.status === 400 && this.failureMessagePatterns.INVALID_PASSWORD_REGEX.test(err.error)) {
          // Show an error message to the user next to the currentPassword input field
          this.changePasswordForm.get('currentPassword')?.setErrors({ wrongPassword: true });
        } else {
          // Show an error message to the user if there was an error registering the user and it is not clear, why
          this.fatalChangePasswordError = true;
        }
        console.error('Changing the password failed', err);
      }
    })
  }
}
