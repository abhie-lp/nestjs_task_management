import { InternalServerErrorException, Logger } from "@nestjs/common";
import { UserAccount } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./task.entity";
import { TaskStatus } from "./tasks-status.enum";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    private logger = new Logger(TaskRepository.name, {timestamp: true})

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

    async getTasks(filterDto: GetTasksFilterDto, user: UserAccount): Promise<Task[]> {
        const { status, search } = filterDto

        const query = this.createQueryBuilder("task")
        query.where({ user })
        this.logger.debug("Get task for status")
        if (status) {
            query.where("task.status = :status", { status })
        }
        this.logger.debug("Get task for search")
        if (search) {
            query.where(
                "(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))",
                { search: `%${search}%`}
            )
        }

        try {
            const tasks = await query.getMany()
            return tasks
        } catch (error) {
            this.logger.error(
                `Failed to get tasks for user "${user.username}". ` +
                `Filters "${JSON.stringify(filterDto)}"`,
                error.stack
            )
            throw new InternalServerErrorException()
        }
    }
}