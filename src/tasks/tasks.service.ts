import { Injectable } from '@nestjs/common';
import { Task, TaskStatus,  } from './tasks.model';
import { v4 as uuid } from "uuid";
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto

        let tasks = this.getAllTasks()

        // filter with status
        if (status) {
            tasks = tasks.filter(task => task.status === status)
        }
        // filter with status
        if (search) {
            tasks = tasks.filter(task => {
                if (task.title.includes(search) || task.description.includes(search)) {
                    return true
                }
                return false
            })
        }
        // return final result
        return tasks
    }

    createTask(createTaskDTO: CreateTaskDTO): Task {
        const { title, description } = createTaskDTO
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task)
        return task
    }

    getTaskById(id: string): Task {
        return this.tasks.find((task) => task.id === id)
    }

    deleteTaskById(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTaskStatusById(id: string, status: TaskStatus) {
        const task: Task = this.getTaskById(id)
        task.status = status
        return task
    }
}
