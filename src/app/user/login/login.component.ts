import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailPatternValidator } from '../../shared/validators/email-pattern.validator';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FAILURE_MESSAGE_PATTERNS } from '../../shared/validators/failure-message-patterns';
import { VALIDATOR_ERROR_KEYS } from '../../shared/validators/validator-error-keys';

/**
 * Component responsible for the login page of the application.
 */
@Component({
  selector: 'mh-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth-form/auth-shared-styles.scss']
})
export class LoginComponent {
  private failureMessagePatterns = FAILURE_MESSAGE_PATTERNS;

  /**
   * Keys for the error messages of the form fields.
   */
  validatorErrorKeys = VALIDATOR_ERROR_KEYS;

  /** Signals if the form is currently being submitted, e.g. to show a loading spinner */
  isLoginFormLoading: boolean = false;

  /** Used to show an error message if the user or email is not correct */
  userOrEmailNotCorrect: boolean = false;

  /** Used to show an error message if the login did not work and it's not clear, why */
  fatalLoginError: boolean = false;

  /**
   * Form group for the login form.
   */
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, emailPatternValidator()]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Method to submit the login form. Called when the user submits the login form.
   */
  onSubmit() {
    // Hide the error messages if the user tries to register again
    this.userOrEmailNotCorrect = false;
    this.fatalLoginError = false;

    // Check if the user has entered valid data in the input fields
    if (this.loginForm.invalid) {
      return;
    }

    // Disable the form and signal that the form is loading while the user is being signed in, e.g. to show a loading spinner
    this.loginForm.disable();
    this.isLoginFormLoading = true;

    // Try to sign in the user
    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';
    this.authService.login(email, password).subscribe({
      next: () => {
        // Navigate to the home page upon successful login
        this.router.navigate(['/home']);
      },
      error: err => {
        // Enable the form again for the user to try again
        this.loginForm.enable();
        this.isLoginFormLoading = false;

        // Check if the cause of the error is known
        if (err.status === 404 && this.failureMessagePatterns.EMAIL_DOES_NOT_EXIST_REGEX.test(err.error)
          || err.status === 400 && this.failureMessagePatterns.INVALID_PASSWORD_REGEX.test(err.error)) {
          this.userOrEmailNotCorrect = true;
        } else {
          // Show a fatal error message if there was an unexpected error
          this.fatalLoginError = true;
        }
      }
    });
  }
}
