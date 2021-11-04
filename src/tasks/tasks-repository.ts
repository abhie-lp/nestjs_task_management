import { UserAccount } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./task.entity";
import { TaskStatus } from "./tasks-status.enum";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async createTask(
        createTaskDto: CreateTaskDTO,
        userAccount: UserAccount
    ): Promise<Task> {
        const { title, description } = createTaskDto
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user: userAccount
        })

        await this.save(task)
        return task
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const query = this.createQueryBuilder("task")
        const { status, search } = filterDto
        if (status) {
            query.where("task.status = :status", { status })
        }

        if (search) {
            query.where(
                "LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)",
                { search: `%${search}%`}
            )
        }

        const tasks = await query.getMany()
        return tasks
    }
}