import { JwtInterceptor } from './jwt-interceptor';
import { HttpHandler, HttpRequest } from "@angular/common/http";

/**
 * Tests the `JwtInterceptor` class.
 */
describe('JwtInterceptor', () => {
  it('should create an instance', () => {
    expect(new JwtInterceptor()).toBeTruthy();
  });

  it('should add Authorization header if token is available', () => {
    const interceptor = new JwtInterceptor();
    const token = 'test-token';
    localStorage.setItem('JWT_Token', token);

    const req = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: jasmine.createSpy('handle').and.callFake((request: HttpRequest<any>) => {
        expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
        return {
          subscribe: () => { }
        };
      })
    };

    interceptor.intercept(req, next);
    expect(next.handle).toHaveBeenCalled();
  });

  it('should not add Authorization header if token is not available', () => {
    const interceptor = new JwtInterceptor();
    localStorage.removeItem('JWT_Token');

    const req = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: jasmine.createSpy('handle').and.callFake((request: HttpRequest<any>) => {
        expect(request.headers.has('Authorization')).toBe(false);
        return {
          subscribe: () => { }
        };
      })
    };

    interceptor.intercept(req, next);
    expect(next.handle).toHaveBeenCalled();
  });
});
