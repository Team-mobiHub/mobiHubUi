import { Injectable } from '@angular/core';
import { RegisterDto } from '../dtos/register-dto';
import { catchError, map, Observable } from 'rxjs';
import { UserDto } from '../dtos/user-dto';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

/**
 * The `UserService` class provides methods for user management.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  /**
   * Creates an instance of UserService.
   *
   * @param http - An instance of HttpClient used to make HTTP requests.
   * @param authService - An instance of AuthService used to perform authentication and authorization operations.
   */
  constructor(private http: HttpClient,
    private authService: AuthService
  ) {
    super();
  }

  /**
   * Registers a new user.
   *
   * @param user - The user data transfer object containing the registration details.
   * @returns An Observable that emits the registered user data transfer object.
   */
  register(user: RegisterDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.userUrl, user);
  }

  /**
   * Updates an existing user.
   * 
   * @param user - The new userdata to be updated
   * @returns {Observable<UserDto>} Updated userdata
   */
  update(user: UserDto): Observable<UserDto> {
    return this.http.put<UserDto>(this.userUrl, user)
  }

  /**
   * Retrieves a user by their ID.
   * @param id
   */
  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(this.userUrl + '/' + id);
  }


  /**
   * Retrieves a user by their email address.
   *
   * @param email - The email address of the user to retrieve.
   * @returns An Observable that emits the UserDto object corresponding to the provided email.
   */
  getByEmail(email: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.userUrl}/email/${email}`);
  }

  /**
   * Changes the password of a user.
   * 
   * @param oldPassword - The old password of the user.
   * @param newPassword - The new password of the user.
   * @returns An Observable that emits the response from the server.
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const changePasswordDto = { oldPassword, newPassword };

    return this.http.put<any>(`${this.authUrl}/change-password`, changePasswordDto);
  }

  /**
   * Deletes a user by their ID.
   * 
   * @param userId - The ID of the user to delete.
   * @returns An Observable that emits the response from the server.
   */
  delete(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.userUrl}/${userId}`).pipe(
      map(response => {
        this.authService.logoutLocal();
        return response;
      }),
      catchError(error => {
        console.error('Error deleting user:', error);
        throw error;
      })
    );
  }

  /**
   * Verifies the email address of a user.
   * 
   * @param token - The token that was sent to the user via email. It is passed via the link in the email.
   * @returns An Observable that emits the response from the server.
   */
  handleVerifyEmailLink(token: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  /**
   * Sends a password reset email to the user with the provided email address.
   * 
   * @param email - The email address of the user who wants to reset their password.
   * @returns An Observable that emits the response from the server.
   */
  resetPasswordWithEmail(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password/start/${email}`, null);
  }

  /**
   * Sets a new password for the user with the provided token.
   * This token is passed via the link in the email sent to the user. @see {@link resetPasswordWithEmail}
   * 
   * @param token - The token that was sent to the user via email. It is passed via the link in the email.
   * @param newPassword - The new password that the user wants to set.
   * 
   * @returns An Observable that emits the response from the server.
   */
  resetPasswordSetNew(token: string, newPassword: String): Observable<any> {
    return this.http.put(`${this.authUrl}/reset-password/complete/${token}`, { newPassword });
  }
}
