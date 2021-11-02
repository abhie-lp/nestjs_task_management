import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true, length: 32 })
    username: string

    @Column({ length: 64 })
    password: string
}