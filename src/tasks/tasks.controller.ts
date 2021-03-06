import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserAccount } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger(TasksController.name)

    constructor(private taskService: TasksService) {}

    @Get("/")
    getTasks(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user: UserAccount
    ): Promise<Task[]> {
        this.logger.verbose(
            `User "${user.username}" retrieving all tasks ` +
            `with filters "${JSON.stringify(filterDto)}"`
        )
        return this.taskService.getTasks(filterDto, user)
    }

    @Post("/")
    createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: UserAccount
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDTO, user)
    }

    @Get("/:id/")
    getTaskById(@Param("id") id: string, @GetUser() user: UserAccount): Promise<Task> {
        return this.taskService.getTaskById(id, user)
    }

    @Delete("/:id/")
    deleteTaskById(
        @Param("id") id: string,
        @GetUser() user: UserAccount
    ): Promise<void> {
        return this.taskService.deleteTaskById(id, user)
    }

    @Patch("/:id/status")
    updateTaskStatusById(
        @Param("id") id: string,
        @Body() updateTaskStatus: UpdateTaskStatusDTO,
        @GetUser() user: UserAccount
    ): Promise<Task> {
        const { status } = updateTaskStatus
        return this.taskService.updateTaskStatusById(id, status, user)
    }
}
