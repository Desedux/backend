import { UnauthorizedException } from '@nestjs/common';
import { FirebaseConfigService } from './firebase-config.service';
import { FirebaseService } from './firebase.service';
import * as dotenv from 'dotenv';

describe('FirebaseService.handleRestApiError', () => {
  const logIfEnabled = (label: string, value: unknown) => {
    if (process.env.TEST_LOGS === '1') {
      console.log(label, value);
    }
  };

  const callHandleRestApiError = (service: FirebaseService, error: any) => {
    // Method is private, but we want to unit-test its behavior directly.
    (service as any).handleRestApiError(error);
  };

  const expectUnauthorizedPayload = (
    fn: () => void,
    expectedMessage: string,
  ) => {
    try {
      fn();
      throw new Error('Expected function to throw');
    } catch (error: any) {
      logIfEnabled(
        'UnauthorizedException.getResponse():',
        error?.getResponse?.(),
      );
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.getStatus()).toBe(401);
      expect(error.getResponse()).toEqual({
        statusCode: 401,
        message: expectedMessage,
        error: 'Unauthorized',
      });
    }
  };

  let service: FirebaseService;

  beforeAll(() => {
    dotenv.config();
  });

  beforeEach(() => {
    service = new FirebaseService(new FirebaseConfigService('test-api-key'));
  });

  it('INVALID_LOGIN_CREDENTIALS -> UnauthorizedException("Invalid login credentials")', () => {
    expectUnauthorizedPayload(
      () =>
        callHandleRestApiError(service, {
          response: {
            data: {
              error: { code: 400, message: 'INVALID_LOGIN_CREDENTIALS' },
            },
          },
        }),
      'Invalid login credentials',
    );
  });

  it('INVALID_REFRESH_TOKEN -> UnauthorizedException("Invalid refresh token")', () => {
    expectUnauthorizedPayload(
      () =>
        callHandleRestApiError(service, {
          response: {
            data: { error: { code: 400, message: 'INVALID_REFRESH_TOKEN' } },
          },
        }),
      'Invalid refresh token',
    );
  });

  it('TOKEN_EXPIRED -> UnauthorizedException("Token expired")', () => {
    expectUnauthorizedPayload(
      () =>
        callHandleRestApiError(service, {
          response: {
            data: { error: { code: 400, message: 'TOKEN_EXPIRED' } },
          },
        }),
      'Token expired',
    );
  });

  it('USER_DISABLED -> UnauthorizedException("User disabled")', () => {
    expectUnauthorizedPayload(
      () =>
        callHandleRestApiError(service, {
          response: {
            data: { error: { code: 400, message: 'USER_DISABLED' } },
          },
        }),
      'User disabled',
    );
  });

  it('messageKey desconhecida -> UnauthorizedException com a própria chave (fallback)', () => {
    expectUnauthorizedPayload(
      () =>
        callHandleRestApiError(service, {
          response: {
            data: { error: { code: 400, message: 'SOME_NEW_FIREBASE_KEY' } },
          },
        }),
      'Something went wrong with your credentials. Please try again later.',
    );
  });

  it('erro que não é 400 (ou shape inesperado) -> throw new Error(error.message)', () => {
    try {
      callHandleRestApiError(service, {
        message: 'boom',
        response: { data: { error: { code: 500, message: 'INTERNAL_ERROR' } } },
      });
      throw new Error('Expected function to throw');
    } catch (error: any) {
      logIfEnabled('Error.message:', error?.message);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Something went wrong');
    }
  });
});
