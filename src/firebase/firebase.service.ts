import * as firebaseAdmin from 'firebase-admin';
import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;
import { FirebaseConfigService } from './firebase-config.service';
import axios from 'axios';
import { CreateRequest, DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseRefreshTokenResponse } from './interface/firebaseRefreshToken.interface';
import { FirebaseSignInResponse } from './interface/firebaseSignInResponse.interface';
import { FirebaseErrorResponse } from './interface/firebaseErrorResponse';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';

@Injectable()
export class FirebaseService {
  private readonly apiKey: string;
  private logger: Logger = new Logger(this.constructor.name);

  constructor(firebaseConfig: FirebaseConfigService) {
    this.apiKey = firebaseConfig.apiKey;
  }

  async createUser(props: CreateRequest): Promise<UserRecord> {
    return firebaseAdmin
      .auth()
      .createUser(props)
      .catch((error): never => this.handleFirebaseAuthError(error));
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    try {
      return await firebaseAdmin.auth().getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw error;
    }
  }

  async getUserByUid(uid: string): Promise<UserRecord | null> {
    try {
      return await firebaseAdmin.auth().getUser(uid);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw error;
    }
  }

  async changePassword(
    email: string,
    newPassword: string,
  ): Promise<UserRecord> {
    const user = await firebaseAdmin
      .auth()
      .getUserByEmail(email)
      .catch((error): never => this.handleFirebaseAuthError(error));
    if (user.disabled) {
      throw new HttpException('User disabled', 403);
    }
    return firebaseAdmin
      .auth()
      .updateUser(user.uid, { password: newPassword })
      .catch((error): never => this.handleFirebaseAuthError(error));
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    return firebaseAdmin
      .auth()
      .verifyIdToken(token)
      .catch((error): never => this.handleFirebaseAuthError(error));
  }

  async refreshIdToken(
    refreshToken: string,
  ): Promise<FirebaseRefreshTokenResponse> {
    const url = `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`;
    return await this.sendPostRequest(url, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).catch((error) => {
      this.handleRestApiError(error);
    });
  }

  async singInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<FirebaseSignInResponse> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    }).catch((error) => {
      this.handleRestApiError(error);
    });
  }

  private async sendPostRequest(url: string, body: any) {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  private handleFirebaseAuthError(error: any): never {
    if (error.code?.startsWith('auth/')) {
      throw new BadRequestException(error.message);
    }
    throw new Error(error.message);
  }

  private handleRestApiError(error: any) {
    const errorResponse: FirebaseErrorResponse | undefined =
      error?.response?.data;
    if (errorResponse?.error?.code === 400) {
      const messageKey = errorResponse.error?.message;
      const message =
        {
          INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials',
          INVALID_REFRESH_TOKEN: 'Invalid refresh token',
          TOKEN_EXPIRED: 'Token expired',
          USER_DISABLED: 'User disabled',
        }[messageKey] ??
        'Something went wrong with your credentials. Please try again later.';

      throw new UnauthorizedException(message);
    }
    this.logger.error(
      `[handleRestApiError]: Unknown error: ${JSON.stringify(errorResponse)}`,
    );
    throw new InternalServerErrorException('Something went wrong');
  }
}
