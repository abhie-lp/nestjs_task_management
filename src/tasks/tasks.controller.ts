import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get("/")
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        // If we have filters defined, call tasksService.getTasksWithFilter
        // otherwise, just get all the tasks
        if (Object.keys(filterDto).length) {
            return this.taskService.getTasksWithFilters(filterDto)
        } else {
            return this.taskService.getAllTasks()
        }
    }

    @Post("/")
    createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
        return this.taskService.createTask(createTaskDTO)
    }

    @Get("/:id/")
    getTaskById(@Param("id") id: string): Task {
        return this.taskService.getTaskById(id)
    }

    @Delete("/:id/")
    deleteTaskById(@Param("id") id: string): void {
        this.taskService.deleteTaskById(id)
    }

    @Patch("/:id/status")
    updateTaskStatusById(@Param("id") id: string, @Body() updateTaskStatus: UpdateTaskStatusDTO): Task {
        const { status } = updateTaskStatus
        return this.taskService.updateTaskStatusById(id, status)
    }
}
