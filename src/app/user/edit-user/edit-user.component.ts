import { Component, inject } from '@angular/core';
import { UserDto } from '../../shared/dtos/user-dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailPatternValidator } from '../../shared/validators/email-pattern.validator';
import { Router } from '@angular/router';
import { DATA_CONSTANTS } from '../../shared/validators/data-constants';
import { UserService } from '../../shared/services/user.service';
import { FAILURE_MESSAGE_PATTERNS } from '../../shared/validators/failure-message-patterns';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { VALIDATOR_ERROR_KEYS } from '../../shared/validators/validator-error-keys';

@Component({
  selector: 'mh-edit-user',
  standalone: false,

  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})

/**
 * The edit-user component represent the edit-user page that allows the user to edit his account data.
 * This means changing his username, email, password, profile picture and deleting his account.
 */

export class EditUserComponent {

  protected profilePictureSize = {
    MAX_PROFILE_PICTURE_SIZE : 1, // times coefficient
    MAX_SIZE_COEFFICIENT : 1024 * 1024,
    SIZE_SUFFIX : "MiB"
  }
  /** The userDTO that is logged in */
  user: UserDto | null | undefined;
  /** Error states for the component */
  errorStates = {
    fatalUpdateError: false,
    pictureUploadError: false,
    invalidPictureFileType: false,
    /** Error if the user uploads profile picture that is too big. Is defined if the error occours. */
    profilePictureTooLargeError: 0
  }

  /**
   * Keys for the error messages of the form fields.
   */
  validatorErrorKeys = VALIDATOR_ERROR_KEYS;

  /** True, if the edit user page is currently fetching the user data */
  public isEditPageLoading: boolean = true;

  /** Other states for the component */
  public isEditUserFormLoading: boolean = false;

  /** Flag to signal if the submit was successful */
  public submitSuccessful: boolean = false;

  /** Uploaded profile picture. Is the same as the old one if the user has not given any input */
  public uploadedProfilePicture: Int8Array | null | undefined;

  /** the ByteArray that is put in the request JSON */
  public profilePictureToUpload: Int8Array | null = null;

  /** The form used for inserting the updated data */
  public editUserForm: any;

  private router: Router = inject(Router);

  constructor(private authService: AuthService, private userService: UserService, private sanitizer: DomSanitizer, private dialog: MatDialog) {
    this.authService.getCurrentUser().subscribe({
      next: user => { // if somehow user gets through without auth, go to login
        this.user = user

        this.createEditForm()
        this.setProfilePictureToUpload()
        this.isEditPageLoading = false
      },
      error: () => {
        this.router.navigate(['/user/login']);
      }
    }
    ).unsubscribe
  }

  private createEditForm() {
    this.editUserForm = new FormGroup({
      username: new FormControl(
        this.user?.name,
        [Validators.required, Validators.minLength(DATA_CONSTANTS.MINIMUM_USERNAME_LENGTH), Validators.maxLength(DATA_CONSTANTS.MAXIMUM_USERNAME_LENGTH)]
      ),
      email: new FormControl(
        this.user?.email,
        [Validators.required, emailPatternValidator(), Validators.maxLength(DATA_CONSTANTS.MAXIMUM_EMAIL_LENGTH)]
      ),
    });
  }

  /**
   * Runs the FileReader when the user has selected a new profile picture
   * @param event the event has embodies the file selection
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        this.errorStates.invalidPictureFileType = true;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedProfilePicture = e.target.result;
      };

      // start fileReader
      reader.readAsArrayBuffer(file);
      // sets the status variables depending on the status of the loading operation
      reader.addEventListener("loadstart", () => (this.isEditUserFormLoading = true, this.errorStates.pictureUploadError = false, this.errorStates.invalidPictureFileType = false));
      reader.addEventListener("loadend", () => this.isEditUserFormLoading = false);
      reader.addEventListener("load", () => this.setProfilePictureToUpload());
      reader.addEventListener("error", () => this.errorStates.pictureUploadError = true);
      reader.addEventListener("abort", () => this.uploadedProfilePicture = null);
    }
  }

  /**
   * Converts the ArrayBuffer from the fileReader to base64 in order to display the image
   * 
   * @param the ArrayBuffer (Blob) that the fileReader read
   */
  arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Handles the state of the page after the user has submitted his editUserForm
   */
  onSubmit() {
    // Hide the fatal error message if the user tries to submit again
    this.errorStates.fatalUpdateError = false;
    // Check if the user has entered valid data in the input fields
    if (this.editUserForm.invalid) {
      return;
    }
    this.setProfilePictureToUpload();
    const newUserData: UserDto = this.setRequestDTO()
    // disable the form and set the form to be loading
    this.editUserForm.disable();
    this.isEditUserFormLoading = true;

    this.userService.update(newUserData).subscribe({
      next: () => {
        // Show a success message if the user has edited his data successfully
        this.submitSuccessful = true
        this.isEditUserFormLoading = false
        console.warn("User edited successfully")
        this.onNgInit()
        this.router.navigate(["/user/" + this.user?.id])
      },
      error: err => {
        // Enable the form again for the user to try again
        this.editUserForm.enable()
        this.isEditUserFormLoading = false

        // Check if the cause of the error is known
        this.checkErrors(err);

        console.error('Edit failed', err);
      }
    });
  }

  private setRequestDTO = (): UserDto => {
    return {
      id: this.user?.id ?? null,
      name: this.editUserForm.value.username || this.user?.name,
      email: this.editUserForm.value.email || this.user?.email,
      isEmailVerified: this.user?.isEmailVerified!!,
      teams: this.user?.teams!!,
      profilePictureLink: this.user?.profilePictureLink!!, // old Token
      profilePicture: this.profilePictureToUpload ? Array.from(new Int8Array(this.profilePictureToUpload)) : null,
      isAdmin: false
    };
  }

  private checkErrors(err: any) {
    if (err.status === 409 && FAILURE_MESSAGE_PATTERNS.EMAIL_IN_USE_REGEX.test(err.error)) {
      // Show an error message to the user if the email address is already in use
      this.editUserForm.get('email')?.setErrors({ emailInUse: true });
    } else if (err.status === 409 && FAILURE_MESSAGE_PATTERNS.USERNAME_IN_USE_REGEX.test(err.error)) {
      // Show an error message to the user if the username is already in use
      this.editUserForm.get('username')?.setErrors({ usernameInUse: true });
    } else if (err.status === 400 && FAILURE_MESSAGE_PATTERNS.UPLOADED_PROFILE_PICTURE_TOO_LARGE_REGEX.test(err.error)) {
      const match = FAILURE_MESSAGE_PATTERNS.UPLOADED_PROFILE_PICTURE_TOO_LARGE_REGEX.exec(err.error);
      if (match && match[1]) {
        this.errorStates.profilePictureTooLargeError = parseInt(match[1], 10) / 10e6; // get 1. group from regex and convert to MB
      }
    } else {
      // Show an error message to the user if there was an error registering the user and it is not clear, why
      this.errorStates.fatalUpdateError = true;
    }
  }

  /** Load the pictures on load */
  onNgInit() {
    this.setProfilePictureToUpload()
  }

  private async setProfilePictureToUpload() {
    if (this.uploadedProfilePicture) {
      let profilePictureToCheck = new Int8Array(this.uploadedProfilePicture);
      if (profilePictureToCheck.length > this.profilePictureSize.MAX_PROFILE_PICTURE_SIZE * this.profilePictureSize.MAX_SIZE_COEFFICIENT) {
        this.errorStates.profilePictureTooLargeError = this.profilePictureSize.MAX_PROFILE_PICTURE_SIZE; // Set error state
      } else {
        this.profilePictureToUpload = profilePictureToCheck

      }
    } else if (this.user?.profilePictureLink) {
      this.profilePictureToUpload = await fetch(this.user.profilePictureLink)
        .then(response => response.arrayBuffer())
        .then(buffer => new Int8Array(buffer))
    } else {
      this.profilePictureToUpload = await fetch('/images/default_profile_picture.png')
        .then(response => response.arrayBuffer())
        .then(buffer => new Int8Array(buffer));
    }
  }

  /** Open the delete user dialog where a warning is shown */
  openDeleteUserDialog() {
    let deleteDialogRef = this.dialog.open(DeleteUserDialogComponent, { width: '300px', data: this.user })

    deleteDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      }
    });
  }
}


