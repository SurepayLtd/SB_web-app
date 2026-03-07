/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

/** rxjs Imports */
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Mock Two-Factor Authentication Interceptor for testing purposes.
 *
 * This interceptor simulates 2FA backend responses without requiring a real backend.
 * Enable this in app.module.ts providers when testing 2FA functionality.
 *
 * To enable:
 * 1. Add to app.module.ts providers array:
 *    {
 *      provide: HTTP_INTERCEPTORS,
 *      useClass: MockTwoFactorInterceptor,
 *      multi: true
 *    }
 * 2. Make sure it's added BEFORE the actual AuthenticationInterceptor
 *
 * To disable: Remove from providers array
 */
@Injectable()
export class MockTwoFactorInterceptor implements HttpInterceptor {
  private mockOTP = '123456'; // The valid OTP for testing
  private otpRequested = false;
  private otpRequestTime = 0;
  private readonly OTP_VALIDITY_SECONDS = 300; // 5 minutes

  /**
   * Intercepts HTTP requests and returns mock responses for 2FA endpoints.
   * @param {HttpRequest<any>} request HTTP request.
   * @param {HttpHandler} next HTTP handler.
   * @returns {Observable<HttpEvent<any>>} HTTP event.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url;

    // Mock authentication endpoint - return credentials with 2FA required
    if (url.includes('/authentication') && request.method === 'POST') {
      const mockCredentials = {
        username: 'mifos',
        userId: 1,
        base64EncodedAuthenticationKey: 'bWlmb3M6cGFzc3dvcmQ=',
        authenticated: true,
        officeId: 1,
        officeName: 'Head Office',
        staffId: 1,
        staffDisplayName: 'Test User',
        roles: [{ id: 1, name: 'Super user' }],
        permissions: ['ALL_FUNCTIONS'],
        shouldRenewPassword: false,
        isTwoFactorAuthenticationRequired: true // Enable 2FA
      };

      return of(new HttpResponse({ status: 200, body: mockCredentials })).pipe(delay(500));
    }

    // Mock get delivery methods endpoint
    if (url.includes('/twofactor') && request.method === 'GET') {
      const mockDeliveryMethods = [
        {
          id: 1,
          name: 'SMS',
          target: '+1234567890'
        },
        {
          id: 2,
          name: 'Email',
          target: 'user@example.com'
        }
      ];

      return of(new HttpResponse({ status: 200, body: mockDeliveryMethods })).pipe(delay(300));
    }

    // Mock request OTP endpoint
    if (url.includes('/twofactor') && request.method === 'POST' && !url.includes('validate') && !url.includes('invalidate')) {
      this.otpRequested = true;
      this.otpRequestTime = Date.now();

      const deliveryMethod = request.params.get('deliveryMethod') || 'SMS';

      const mockResponse = {
        tokenLiveTimeInSec: this.OTP_VALIDITY_SECONDS,
        deliveryMethod: deliveryMethod
      };

      // Log the OTP to console for testing
      console.log('==============================================');
      console.log('MOCK 2FA: OTP has been sent!');
      console.log(`Delivery Method: ${deliveryMethod}`);
      console.log(`Your OTP is: ${this.mockOTP}`);
      console.log(`Valid for: ${this.OTP_VALIDITY_SECONDS / 60} minutes`);
      console.log('==============================================');

      return of(new HttpResponse({ status: 200, body: mockResponse })).pipe(delay(800));
    }

    // Mock validate OTP endpoint
    if (url.includes('/twofactor/validate') && request.method === 'POST') {
      const token = request.params.get('token');

      // Check if OTP was requested
      if (!this.otpRequested) {
        return throwError(() => ({
          status: 400,
          error: {
            errors: [{ defaultUserMessage: 'Please request OTP first' }]
          }
        })).pipe(delay(300));
      }

      // Check if OTP is expired
      const currentTime = Date.now();
      const elapsed = (currentTime - this.otpRequestTime) / 1000;
      if (elapsed > this.OTP_VALIDITY_SECONDS) {
        this.otpRequested = false;
        return throwError(() => ({
          status: 400,
          error: {
            errors: [{ defaultUserMessage: 'OTP has expired. Please request a new one.' }]
          }
        })).pipe(delay(300));
      }

      // Validate OTP
      if (token === this.mockOTP) {
        const validTo = currentTime + (this.OTP_VALIDITY_SECONDS * 1000);
        const mockTwoFactorToken = {
          token: 'mock-2fa-token-' + Date.now(),
          validTo: validTo
        };

        console.log('==============================================');
        console.log('MOCK 2FA: OTP validated successfully!');
        console.log('==============================================');

        this.otpRequested = false;
        return of(new HttpResponse({ status: 200, body: mockTwoFactorToken })).pipe(delay(500));
      } else {
        return throwError(() => ({
          status: 400,
          error: {
            errors: [{ defaultUserMessage: 'Invalid OTP. Please try again.' }]
          }
        })).pipe(delay(300));
      }
    }

    // Mock invalidate token endpoint
    if (url.includes('/twofactor/invalidate') && request.method === 'POST') {
      console.log('MOCK 2FA: Token invalidated');
      return of(new HttpResponse({ status: 200, body: {} })).pipe(delay(200));
    }

    // For all other requests, pass through to the real backend
    return next.handle(request);
  }
}

