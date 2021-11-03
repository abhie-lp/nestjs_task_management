import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UserAccount } from "./user.entity";
import * as bcrypt from "bcrypt";

@EntityRepository(UserAccount)
export class UserRepository extends Repository<UserAccount> {
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto

        // Generate salt
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = this.create({ username, password: hashedPassword })
        try {
            await this.save(user)
        } catch (error) {
            if (error.code === "23505") { // duplicate username
                throw new ConflictException("Username already exists.")
            } else {
                throw new InternalServerErrorException(error.message)
            }
        }
    }
}