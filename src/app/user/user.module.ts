import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { SharedModule } from '../shared/dtos/shared.module';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { DeleteUserDialogComponent } from './edit-user/delete-user-dialog/delete-user-dialog.component';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { ResetPasswordSetNewComponent } from './reset-password-set-new/reset-password-set-new.component';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    ConfirmEmailComponent,
    RegisterComponent,
    LoginComponent,
    ShowUserComponent,
    EditUserComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    AuthFormComponent,
    DeleteUserDialogComponent,
    ResetPasswordSetNewComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatDialogContent,
    MatDialogActions,
    MatProgressBarModule,
    SharedModule,
    MatIcon,
    MatProgressSpinner,
    MatButtonToggleModule
  ]
})
export class UserModule { }
