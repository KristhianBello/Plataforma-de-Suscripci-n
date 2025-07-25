import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 'request.user' es el objeto que la JwtStrategy retorna en su método 'validate'
    return data ? request.user?.[data as string] : request.user;
  },
);