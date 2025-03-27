import { Component } from '@angular/core';

/**
 * AuthFormComponent is a shared component that contains code that is used for multiple other components related to authentication.
 * For example, it is used in the RegisterComponent and LoginComponent.
 */
@Component({
  selector: 'mh-auth-form',
  standalone: false,
  
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss', './auth-shared-styles.scss']
})
export class AuthFormComponent {

}
