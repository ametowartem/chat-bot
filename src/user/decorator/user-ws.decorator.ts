import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserWs = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToWs().getClient();
    return request.user.uuid;
  },
);
