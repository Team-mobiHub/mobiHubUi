import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { UserDto } from '../dtos/user-dto';
import { throwError } from 'rxjs';

const JWT_TOKEN = 'JWT_Token';
const EXPIRES_AT = 'expires_at';
const EMAIL = 'email';

const loginResponse = {
  token: '53e11eb9-9e46-441f-b23b-9861639b147f',
  expiresAt: '2025-02-17T16:10:34.480Z'
}

const dummyUser: UserDto = {
  id: 1,
  email: 'test@test.de',
  isEmailVerified: true,
  profilePictureLink: '',
  isAdmin: false,
  teams: [],
  name: 'Test User',
  profilePicture: null
}

/**
 * Tests the `AuthService` class.
 */
describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let localStore: { [x: string]: string; };

  /**
   * Configures the testing module for the tests.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);

    localStore = {};

    spyOn(window.localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStore[key] = value + '')
    );
    spyOn(window.localStorage, 'removeItem').and.callFake((key) =>
      delete localStore[key]
    );
  });

  /**
   * Tests if the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Tests the `login` method.
   */
  it('login should write values to local storage and return true', () => {
    // Arrange
    const email = 'test@test.de';
    const password = 'password';

    // Act
    service.login(email, password).subscribe(response => {
      // Assert
      expect(response).toBeTrue();
      expect(localStorage.getItem(JWT_TOKEN)).toEqual(loginResponse.token);
      expect(localStorage.getItem(EMAIL)).toEqual(email);
      expect(localStorage.getItem(EXPIRES_AT)).toEqual(loginResponse.expiresAt);
    });

    const request = httpController.expectOne(`${environment.apiUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    request.flush(loginResponse);
  });

  it('login should throw an error when an error occurs', () => {
    // Arrange
    const email = 'test@test.de';
    const password = 'password';

    // Act
    service.login(email, password).subscribe(
      () => fail('expected an error, not a success'),
      error => {
        // Assert
        expect(error).toBeTruthy();
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    request.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('logout should remove values from local storage', () => {
    // Arrange
    fillLocalStorage();

    // Act
    service.logout().subscribe(() => {
      // Assert
      expect(localStorage.getItem(JWT_TOKEN)).toBeNull();
      expect(localStorage.getItem(EMAIL)).toBeNull();
      expect(localStorage.getItem(EXPIRES_AT)).toBeNull();
    });

    const request = httpController.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(request.request.method).toBe('POST');
    request.flush({});
  });

  it('logout should throw an error when an error occurs', () => {
    // Arrange
    fillLocalStorage();

    // Act
    service.logout().subscribe(
      () => fail('expected an error, not a success'),
      error => {
        // Assert
        expect(error).toBeTruthy();
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(request.request.method).toBe('POST');
    request.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('logoutLocal should remove values from local storage', () => {
    // Arrange
    fillLocalStorage();

    // Act
    service.logoutLocal();

    // Assert
    expect(localStorage.getItem(JWT_TOKEN)).toBeNull();
    expect(localStorage.getItem(EMAIL)).toBeNull();
    expect(localStorage.getItem(EXPIRES_AT)).toBeNull();
  });

  it('isAuthenticated should return true when token is present and not expired', () => {
    // Arrange
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);
    fillLocalStorage(expiresAt.toISOString());

    // Act
    const result = service.isAuthenticated();

    // Assert
    expect(result).toBeTrue();
  });

  it('isAuthenticated should return false when token is expired', () => {
    // Arrange
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() - 2);
    fillLocalStorage(expiresAt.toISOString());

    // Act
    const result = service.isAuthenticated();

    // Assert
    expect(result).toBeFalse();
  });

  it('isAuthenticated should return false when token is not present', () => {
    // Arrange
    localStorage.removeItem(JWT_TOKEN);

    // Act
    const result = service.isAuthenticated();

    // Assert
    expect(result).toBeFalse();
  });

  it('isAuthenticated should return false when expiresAt is not present', () => {
    // Arrange
    fillLocalStorage();
    localStorage.removeItem(EXPIRES_AT);

    // Act
    const result = service.isAuthenticated();

    // Assert
    expect(result).toBeFalse();
  });

  it('getCurrentUser should return null when not authenticated', () => {
    // Arrange
    localStorage.removeItem(JWT_TOKEN);
    spyOn(service, 'isAuthenticated').and.returnValue(false);

    // Act
    service.getCurrentUser().subscribe(response => {
      // Assert
      expect(response).toBeNull();
    });
  });

  it('getCurrentUser should return null when email is not present', () => {
    // Arrange
    fillLocalStorage();
    localStorage.removeItem(EMAIL);

    // Act
    service.getCurrentUser().subscribe(response => {
      // Assert
      expect(response).toBeNull();
    });
  });

  it('getCurrentUser should return null when token is expired', () => {
    // Arrange
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() - 2);
    fillLocalStorage(expiresAt.toISOString());

    spyOn(service, 'isAuthenticated').and.returnValue(true);

    // Act
    service.getCurrentUser().subscribe(response => {
      // Assert
      expect(response).toBeNull();
    });
  });

  it('getCurrentUser should return the user when authenticated', () => {
    // Arrange
    const testMailAddress = 'test@test.de'
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);
    fillLocalStorage(expiresAt.toISOString());

    spyOn(service, 'isAuthenticated').and.returnValue(true);

    // Act
    service.getCurrentUser().subscribe(response => {
      // Assert
      expect(response).toBeTruthy();
      if (response) {
        expect(response.id).toEqual(1);
        expect(response.email).toEqual(testMailAddress);
      }
    });

    const request = httpController.expectOne(`${environment.apiUrl}/user/email/${testMailAddress}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyUser);
  });



});

function fillLocalStorage(expiresAt?: string) {
  localStorage.setItem(JWT_TOKEN, 'token');
  localStorage.setItem(EMAIL, 'test@test.de');
  localStorage.setItem(EXPIRES_AT, expiresAt || '2025-02-17T16:10:34.480Z');
}
