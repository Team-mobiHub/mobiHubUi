import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DATA_CONSTANTS } from '../../shared/validators/data-constants';
import { passwordComplexityValidator } from '../../shared/validators/password-requirements.validator';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPasswordErrorStateMatcher } from '../../shared/confirm-password-error-state-matcher';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { VALIDATOR_ERROR_KEYS } from '../../shared/validators/validator-error-keys';

/**
 * This component is shown to the user when he clicks the link in the email to reset the password.
 * The user can set a new password here.
 */
@Component({
  selector: 'mh-reset-password-set-new',
  standalone: false,
  
  templateUrl: './reset-password-set-new.component.html',
  styleUrls: ['./reset-password-set-new.component.scss', '../auth-form/auth-shared-styles.scss']
})
export class ResetPasswordSetNewComponent {
  /**
   * The token that was sent to the user via email to reset the password.
   * It is passed via the link in the email and set with the method {@link ngOnInit}.
   */
  private token: string = '';

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
   * Signals if the form is currently being submitted, e.g. to show a loading spinner.
   */
  isFormLoading: boolean = false;

  /**
   * Used to show an error message if the password could not be changed, and it is not clear, why.
   */
  fatalSetNewPasswordError: boolean = false;

  /**
   * Used to show a success message if the password was changed successfully.
   */
  isNewPasswordSet: boolean = false;

  /**
   * Form group for the reset password set new form.
   */
  resetPasswordSetNewForm = new FormGroup({
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
    validators: passwordMatchValidator('newPassword', 'confirmPassword'),
  });

  constructor(private route: ActivatedRoute, private userService: UserService) {
  
  }

  /**
   * Method to initialize the component.
   * Used for getting the token from the URL.
   */
  ngOnInit() {
    // Get the token from the URL
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
  }
  
  /**
   * Method to submit the form.
   */
  onSubmit() {
    // Hide the error messages if the user tries to reset the password again
    this.fatalSetNewPasswordError = false;

    // Check if the user has entered valid data in the input fields
    if (this.resetPasswordSetNewForm.invalid) {
      return;
    }

    // Disable the form and signal that the form is loading while
    // the request is being processed, e.g. to show a loading spinner
    this.resetPasswordSetNewForm.disable();
    this.isFormLoading = true;

    // Try to set the new password
    const newPassword = this.resetPasswordSetNewForm.value.newPassword ?? '';
    this.userService.resetPasswordSetNew(this.token, newPassword).subscribe({
      next: () => {
        // Show a success message if the new password was successfully set
        this.isNewPasswordSet = true;

        console.warn("Password was changed successfully.");
      },
      error: err => {
        console.error('Setting the new password failed', err);

        // Enable the form again for the user to try again
        this.resetPasswordSetNewForm.enable();
        this.isFormLoading = false;

        this.fatalSetNewPasswordError = true;
      }
    });
  }
}
