import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus,  } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { UserAccount } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

    getTasks(filterDto: GetTasksFilterDto, user: UserAccount): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user)
    }

    createTask(
        createTaskDTO: CreateTaskDTO,
        userAccount: UserAccount
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, userAccount)
    }

    async getTaskById(id: string, user: UserAccount): Promise<Task> {
        const found = await this.taskRepository.findOne({where: { id, user }})
        if (!found) {
            throw new NotFoundException(
                `Task with ID '${id}' not found for user ${user.username}`
            )
        }
        return found
    }

    async deleteTaskById(id: string, user: UserAccount): Promise<void> {
        const result = await this.taskRepository.delete({id, user})
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID '${id}' not found.`)
        }
    }

    async updateTaskStatusById(
        id: string, status: TaskStatus, user: UserAccount
    ): Promise<Task> {
        const task = await this.getTaskById(id, user)
        task.status = status
        await this.taskRepository.save(task)
        return task
    }
}
