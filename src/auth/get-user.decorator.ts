import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserAccount } from "./user.entity";

export const GetUser = createParamDecorator(
    (_data, context: ExecutionContext): UserAccount => {
    const req = context.switchToHttp().getRequest()
    return req.user
})