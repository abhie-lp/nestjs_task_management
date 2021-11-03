import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWTPayload } from "./jwt-payload.interface";
import { UserAccount } from "./user.entity";
import { UserRepository } from "./users.repository";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){
        super({
            secretOrKey: "toppo-secretto",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JWTPayload): Promise<UserAccount> {
        const { username } = payload
        const user: UserAccount = await this.userRepository.findOne({ username })
        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}