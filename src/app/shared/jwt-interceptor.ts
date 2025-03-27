import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

const JWT_TOKEN = 'JWT_Token';

/**
 * Interceptor for adding the JWT token to the HTTP requests.
 */
export class JwtInterceptor implements HttpInterceptor {
    /** Add the JWT token to the HTTP requests if it is available in the local storage */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = localStorage.getItem(JWT_TOKEN);
        if (token) {
            const authRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(authRequest);
        } else {
            return next.handle(req);
        }
    }
}
