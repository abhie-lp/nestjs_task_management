import { Task } from "src/tasks/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserAccount {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true, length: 32 })
    username: string

    @Column({ length: 64 })
    password: string

    @OneToMany(_type => Task, task => task.user, {eager: true})
    tasks: Task[];
}