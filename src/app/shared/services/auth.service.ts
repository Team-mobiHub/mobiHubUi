import { Injectable, Injector } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../dtos/user-dto';
import { UserService } from './user.service';
import { Observable, map, catchError, of, switchMap } from 'rxjs';
import { LoginDTO } from '../dtos/login-dto';

const JWT_TOKEN = 'JWT_Token';
const EMAIL = 'email';
const EXPIRES_AT = 'expires_at';
const MESSAGE_LOGIN_ERROR = 'Login error: ';

/**
 * The `AuthService` class provides methods for user authentication and authorization.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private loggedInUser: UserDto | null = null;
  private userService: UserService | null = null;

  /**
   * Creates an instance of AuthService.
   * 
   * @param http - An instance of HttpClient used to make HTTP requests.
   * @param injector - An instance of Injector used to dynamically inject services.
   */
  constructor(private http: HttpClient,
    private injector: Injector) {
    super();
  }

  /**
   * Logs in a user with the provided email and password.
   * 
   * @param email - The email address of the user.
   * @param password - The password of the user.
   * @returns An Observable that emits `true` if the login is successful, otherwise throws an error.
   * 
   * The method performs the following steps:
   * 1. Sends a POST request to the login endpoint with the provided email and password.
   * 2. If the login is successful, stores the JWT token in local storage.
   * 3. Retrieves the user details by email and sets the logged-in user information.
   * 4. If any error occurs during the login or user retrieval process, logs the error and removes the JWT token from local storage.
   */
  login(email: string, password: string): Observable<boolean> {
    const loginDto: LoginDTO = { email, password };

    return this.http.post<any>(`${this.authUrl}/login`, loginDto).pipe(
      switchMap(response => {
        localStorage.setItem(JWT_TOKEN, response.token);
        localStorage.setItem(EXPIRES_AT, response.expiresAt.toString());
        localStorage.setItem(EMAIL, email);

        return of(true);
      }),
      catchError(error => {
        console.error(MESSAGE_LOGIN_ERROR, error);
        throw error;
      })
    );
  }

  /**
   * Logs out the current user by making a POST request to the logout endpoint.
   * 
   * This method performs the following actions:
   * - Sends a POST request to the logout endpoint.
   * - Removes the JWT token from local storage.
   * - Sets the `isLoggedIn` flag to `false`.
   * - Sets the `loggedInUser` to `null`.
   * 
   * If an error occurs during the logout process, it logs the error to the console.
   * 
   * @returns An Observable that emits the response from the logout endpoint.
   */
  logout(): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/logout`, {})
      .pipe(
        map(() => {
          this.logoutLocal();
        }),
        catchError(error => {
          console.error(error);
          throw error;
        })
      );
  }

  /**
   * Logs out the user by removing the JWT token from the local storage.
   */
  logoutLocal() {
    localStorage.removeItem(JWT_TOKEN);
    localStorage.removeItem(EXPIRES_AT);
    localStorage.removeItem(EMAIL);
    this.loggedInUser = null;
  }


  /**
   * Checks if the user is authenticated.
   * 
   * This method verifies if a JWT token is present in the local storage and 
   * if the token has not expired. It returns `true` if both conditions are met, 
   * otherwise it returns `false`.
   * 
   * @returns {boolean} `true` if the user is authenticated, `false` otherwise.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(JWT_TOKEN)
      && this.getExpiration() > new Date();
  }

  private getExpiration(): Date {
    const expiresAt = localStorage.getItem(EXPIRES_AT);
    return expiresAt ? new Date(expiresAt) : new Date();
  }

  /**
   * Retrieves the current logged-in user as an observable.
   * 
   * @returns {Observable<UserDto | null>} An observable that emits the current user if authenticated, or null if not.
   */
  getCurrentUser(): Observable<UserDto | null> {
    if (!this.isAuthenticated()) {
      return of(null);
    }

    if (!this.loggedInUser) {
      const email = localStorage.getItem(EMAIL);

      if (!email || this.getExpiration() < new Date()) {
        return of(null);
      }

      // Dynamically inject UserService
      if (!this.userService) {
        this.userService = this.injector.get(UserService);
      }

      return this.userService.getByEmail(email).pipe(
        map(user => {
          this.loggedInUser = user;
          return user;
        }),
        catchError(error => {
          console.error(MESSAGE_LOGIN_ERROR, error);

          // Remove the token from the local storage because getting the user with this data was not successful.
          localStorage.removeItem(JWT_TOKEN);
          localStorage.removeItem(EXPIRES_AT);
          localStorage.removeItem(EMAIL);
          throw error;
        })
      );
    }
    return of(this.loggedInUser);
  }
}
