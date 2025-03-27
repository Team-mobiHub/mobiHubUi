import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { UserDto } from '../shared/dtos/user-dto';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Component that is responsible for the header of the application.
 */
@Component({
  selector: 'mh-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  /**
   * Information about the currently logged-in user.
   */
  user: UserDto | null = null;

  /**
   * Signals if the user is currently logged in.
   */
  isUserAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Initialize the user information based on the current user
    this.updateUser();
    
    // Call updateUser() whenever the route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => this.updateUser());
  }

  /**
   * Updates the user information stored for the header based on the current user.
   */
  updateUser() {
    // Set user-related variables based on the current user
    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.user = user;
        this.isUserAuthenticated = this.authService.isAuthenticated();
      }
    });
  }

  /**
   * Logs out the currently logged-in user.
   * This method is called by clicking the "Logout" button in the header.
   */
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Call updateUser() so that the header reflects the correct state
        this.updateUser();

        // Navigate to the start page after logging out
        this.router.navigate(['/']);
      },
      error: () => {
        alert("An error occurred while logging out. Please check your internet connection and try again.");
      }
    });
  }
}
