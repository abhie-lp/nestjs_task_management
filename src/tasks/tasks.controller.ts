import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get("/")
    getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskService.getTasks(filterDto)
    }

    @Post("/")
    createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
        return this.taskService.createTask(createTaskDTO)
    }

    @Get("/:id/")
    getTaskById(@Param("id") id: string): Promise<Task> {
        return this.taskService.getTaskById(id)
    }

    @Delete("/:id/")
    deleteTaskById(@Param("id") id: string): Promise<void> {
        return this.taskService.deleteTaskById(id)
    }

    @Patch("/:id/status")
    updateTaskStatusById(@Param("id") id: string, @Body() updateTaskStatus: UpdateTaskStatusDTO): Promise<Task> {
        const { status } = updateTaskStatus
        return this.taskService.updateTaskStatusById(id, status)
    }
}
