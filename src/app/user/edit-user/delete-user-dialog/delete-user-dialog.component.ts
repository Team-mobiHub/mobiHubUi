import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDto } from '../../../shared/dtos/user-dto';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'mh-delete-user-dialog',
  standalone: false,

  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss',
})

/**
 * Dialog for deleting the signed in user. Shows important information for
 * the user to know before deleting his account.
 */
export class DeleteUserDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteUserDialogComponent>)
  private readonly userDto = inject<UserDto>(MAT_DIALOG_DATA);
  private readonly userService = inject(UserService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  /**
   * True, if an error has occoured while sending the delete
   */
  deleteError: boolean = false

  /**
   * Deletes the user that is currently logged in.
   */
  deleteUser() {
    this.userService.delete(this.userDto.id!!).subscribe({
      next: _any => {
        this.authService.logout()
        this.router.navigate(["/"])
        this.dialogRef.close()
      },
      error: () => {
        this.deleteError = true
      }
    })
  }

  /**
   * Closes the dialog.
   */
  close(): void {
    this.dialogRef.close();
  }
}
