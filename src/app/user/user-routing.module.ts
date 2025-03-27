import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { authGuardService } from '../shared/services/auth-guard.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordSetNewComponent } from './reset-password-set-new/reset-password-set-new.component';

const routes: Routes = [
  {
    path: 'changepassword',
    component: ChangePasswordComponent,
    title: 'Change Password',
    pathMatch: 'full',
    canActivate: [authGuardService]
  },
  {
    path: 'confirmemail',
    component: ConfirmEmailComponent,
    title: 'Confirm Email',
    pathMatch: 'full'
  },
  {
    path: 'edit',
    component: EditUserComponent,
    title: 'Edit User',
    pathMatch: 'full',
    canActivate: [authGuardService]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
    pathMatch: 'full'
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent,
    title: 'Reset Password',
    pathMatch: 'full'
  },
  {
    path: 'resetpassword/:token',
    component: ResetPasswordSetNewComponent,
    title: 'Set New Password',
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: ShowUserComponent,
    title: 'Show User',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
