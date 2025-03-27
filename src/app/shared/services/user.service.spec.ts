import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { UserDto } from '../dtos/user-dto';
import { RegisterDto } from '../dtos/register-dto';

const dummyUser: UserDto = {
  id: 1,
  name: 'test-user',
  email: 'test-user@example.com',
  profilePicture: null,
  profilePictureLink: 'test',
  isEmailVerified: true,
  isAdmin: false,
  teams: []
}

describe('UserService', () => {
  let service: UserService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService
      ]
    });
    service = TestBed.inject(UserService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const user: RegisterDto = {
      username: 'test-user',
      email: 'test-user@example.com',
      password: 'aaaaAaaa#'
    };

    service.register(user).subscribe(
      response => {
        expect(response.id).toEqual(1);
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/user`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(user);
    request.flush(dummyUser);
  })

  it('should update an existing user', () => {
    service.update(dummyUser).subscribe(
      response => {
        expect(response.id).toEqual(dummyUser.id);
        expect(response.email).toEqual(dummyUser.email);
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/user`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(dummyUser);
    request.flush(dummyUser);
  });

  it('should get a user by ID', () => {
    const id = 1;

    service.getById(id).subscribe(
      response => {
        expect(response.id).toEqual(dummyUser.id);
        expect(response.email).toEqual(dummyUser.email);
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/user/${id}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyUser);
  });

  it('should get a user by email', () => {
    const email = 'test-user@example.com'

    service.getByEmail(email).subscribe(
      response => {
        expect(response.id).toEqual(dummyUser.id);
        expect(response.email).toEqual(dummyUser.email);
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/user/email/${email}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyUser);
  });

  it('should change the password of a user', () => {
    const oldPassword = 'aaaaAaaa#';
    const newPassword = 'bbbbBbbb#';

    service.changePassword(oldPassword, newPassword).subscribe(
      response => {
        expect(response).toBeTruthy();
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/auth/change-password`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ oldPassword, newPassword });
    request.flush({});
  });

  it('should delete a user', () => {
    const id = 1;

    service.delete(id).subscribe(
      response => {
        expect(response).toBeTruthy()
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/user/${id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });

  it('should handle error when deleting a user', () => {
    const id = 1;
    const errorMessage = 'Error deleting user';

    spyOn(console, 'error');

    service.delete(id).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(console.error).toHaveBeenCalledWith('Error deleting user:', error);
      }
    });

    const request = httpController.expectOne(`${environment.apiUrl}/user/${id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
  });

  it('should start a password reset', () => {
    const email = 'test-user@example.com';

    service.resetPasswordWithEmail(email).subscribe(
      response => {
        expect(response).toBeTruthy();
      }
    );

    const request = httpController.expectOne(`${environment.apiUrl}/auth/reset-password/start/${email}`);
    expect(request.request.method).toBe('POST');
    request.flush({});
  });

  it('should finish a password reset', () => {
    const token = 'test-token';
    const newPassword = 'bbbbBbbb#';

    service.resetPasswordSetNew(token, newPassword).subscribe(
      response => {
        expect(response).toBeTruthy();
      });

    const request = httpController.expectOne(`${environment.apiUrl}/auth/reset-password/complete/${token}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ newPassword });
    request.flush({});
  });
});
