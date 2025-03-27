import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailPatternValidator } from '../../shared/validators/email-pattern.validator';
import { UserService } from '../../shared/services/user.service';
import { VALIDATOR_ERROR_KEYS } from '../../shared/validators/validator-error-keys';

/**
 * Component responsible for the reset password page of the application.
 * On this page, the user can enter their email address to receive an email with a link to reset their password.
 */
@Component({
  selector: 'mh-reset-password',
  standalone: false,
  
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../auth-form/auth-shared-styles.scss']
})
export class ResetPasswordComponent {
  /** Signals if the form is currently being submitted, e.g. to show a loading spinner */
  isResetPasswordFormLoading: boolean = false;

  /** Used to show an error message if the password reset did not work and it's not clear, why */
  fatalResetPasswordError: boolean = false;

  /** Used to show a success message if the reset passwort email was sent successfully */
  resetPasswordEmailSent: boolean = false;

  /**
   * Keys for the error messages of the form fields.
   */
  validatorErrorKeys = VALIDATOR_ERROR_KEYS;

  /**
   * Form group for the reset password form.
   */
  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, emailPatternValidator()])
  });

  constructor(private userService: UserService) {

  }

  /**
   * Method to submit the reset password form. Called when the user submits the reset password form.
   */
  onSubmit() {
    // Hide the error messages if the user tries to reset the password again
    this.fatalResetPasswordError = false;

    // Check if the user has entered valid data in the input fields
    if (this.resetPasswordForm.invalid) {
      return;
    }

    // Disable the form and signal that the form is loading while
    // the request is being processed, e.g. to show a loading spinner
    this.resetPasswordForm.disable();
    this.isResetPasswordFormLoading = true;

    // Try to reset the password
    const email = this.resetPasswordForm.value.email ?? '';
    this.userService.resetPasswordWithEmail(email).subscribe({
      next: () => {
        // Show a success message if the reset password email was sent
        this.resetPasswordEmailSent = true;
        console.warn("Reset password email sent.");
      },
      error: err => {
        console.error('Resetting the password failed', err);

        // Enable the form again for the user to try again
        this.resetPasswordForm.enable();
        this.isResetPasswordFormLoading = false;

        this.fatalResetPasswordError = true;
      }
    });
  }
}
