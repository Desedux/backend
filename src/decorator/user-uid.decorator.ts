import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';

export const UserUid = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user?.uid) {
      return request.user?.uid;
    }
    if (!request.headers.authorization) {
      return null;
    }
    const decodedToken = jwtDecode<{ user_id: string }>(
      request.headers.authorization.split(' ')[1],
    );
    return decodedToken.user_id;
  },
);
