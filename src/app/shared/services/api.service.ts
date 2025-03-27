import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * The `ApiService` class serves as an abstract base class for all services that interact with the backend API.
 * It provides common URL endpoints for authentication, user management, traffic model operations, and team management.
 */
@Injectable({
  providedIn: 'root'
})
export abstract class ApiService {
  // Set the base URL for the backend API
  protected backendBaseUrl: string = environment.apiUrl;

  // URL endpoints for the different types of operations
  protected authUrl: string = this.backendBaseUrl + '/auth';
  protected userUrl: string = this.backendBaseUrl + '/user';
  protected teamUrl: string = this.backendBaseUrl + '/team';

  /**
   * Creates an instance of ApiService.
   *
   * @remarks
   * This constructor will be called by derived classes that extend the `ApiService` class.
   */
  constructor() { }
}
