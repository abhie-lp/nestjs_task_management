import { Exclude } from "class-transformer";
import { UserAccount } from "src/auth/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./tasks-status.enum";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(_type => UserAccount, user => user.tasks, {eager: false})
    @Exclude({ toPlainOnly: true })
    user: UserAccount
}