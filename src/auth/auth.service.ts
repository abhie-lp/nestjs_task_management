import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto
        const user = await this.userRepository.findOne({ username })

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JWTPayload = { username }
            const accessToken = await this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException("Please check login credentials.")
        }
    }
}
