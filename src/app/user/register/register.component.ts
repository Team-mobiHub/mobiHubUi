import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterDto } from '../../shared/dtos/register-dto';
import { emailPatternValidator } from '../../shared/validators/email-pattern.validator';
import { UserService } from '../../shared/services/user.service';
import { passwordComplexityValidator } from '../../shared/validators/password-requirements.validator';
import { DATA_CONSTANTS } from '../../shared/validators/data-constants';
import { FAILURE_MESSAGE_PATTERNS } from '../../shared/validators/failure-message-patterns';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { ConfirmPasswordErrorStateMatcher } from '../../shared/confirm-password-error-state-matcher';
import { VALIDATOR_ERROR_KEYS } from '../../shared/validators/validator-error-keys';

/**
 * Component for the registration form.
 */
@Component({
  selector: 'mh-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../auth-form/auth-shared-styles.scss']
})
export class RegisterComponent {
  /**
   * Patterns for recognizing the error messages that the server can return.
   */
  private failureMessagePatterns = FAILURE_MESSAGE_PATTERNS

  /**
   * Constants for the data validation of the user input fields.
   * E.g. minimum and maximum length of a user password.
   */
  dataConstants = DATA_CONSTANTS

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
  isRegisterFormLoading: boolean = false;

  /**
   * Used to show an error message if the user could not be registered and it's not clear, why.
   */
  fatalRegistrationError: boolean = false;

  /**
   * Used to show a success message if the user was registered successfully.
   */
  registrationComplete: boolean = false;

  constructor(private userService: UserService) {

  }

  /**
   * Form group for the registration form.
   */
  registerForm = new FormGroup({
    email: new FormControl(
      '',
      [Validators.required, emailPatternValidator(), Validators.maxLength(this.dataConstants.MAXIMUM_EMAIL_LENGTH)]
    ),
    username: new FormControl(
      '',
      [Validators.required, Validators.minLength(this.dataConstants.MINIMUM_USERNAME_LENGTH), Validators.maxLength(this.dataConstants.MAXIMUM_USERNAME_LENGTH)]
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
    validators: passwordMatchValidator('newPassword', 'confirmPassword'),
  });

  /**
   * Method to submit the registration form.
   */
  onSubmit() {
    // Hide the error message if the user tries to register again
    this.fatalRegistrationError = false;

    // Check if the user has entered valid data in the input fields
    if (this.registerForm.invalid) {
      return;
    }

    // Prepare the data to be sent to the server
    const registerData: RegisterDto = {
      email: this.registerForm.value.email || '',
      username: this.registerForm.value.username || '',
      password: this.registerForm.value.newPassword || ''
    };

    // Disable the form and signal that the form is loading while the user is being registered, e.g. to show a loading spinner
    this.registerForm.disable();
    this.isRegisterFormLoading = true;

    // Call the user service to register the user
    this.userService.register(registerData).subscribe({
      next: () => {
        // Show a success message if the user was registered successfully
        this.registrationComplete = true;
        console.warn("User registered successfully");
      },
      error: err => {
        // Enable the form again for the user to try again
        this.registerForm.enable();
        this.isRegisterFormLoading = false;

        // Check if the cause of the error is known
        if (err.status === 409 && this.failureMessagePatterns.EMAIL_IN_USE_REGEX.test(err.error)) {
          // Show an error message to the user if the email address is already in use
          this.registerForm.get('email')?.setErrors({ emailInUse: true });
        } else if (err.status === 409 && this.failureMessagePatterns.USERNAME_IN_USE_REGEX.test(err.error)) {
          // Show an error message to the user if the username is already in use
          this.registerForm.get('username')?.setErrors({ usernameInUse: true });
        } else {
          // Show an error message to the user if there was an error registering the user and it is not clear, why
          this.fatalRegistrationError = true;
        }

        console.error('Registration failed', err);
      }
    });
  }
}
