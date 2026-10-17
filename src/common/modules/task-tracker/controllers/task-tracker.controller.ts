import { Controller, Get } from '@nestjs/common';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { TaskTrackerService } from '../services/task-tracker.service';

@Controller('system')
export class TaskTrackerController {
    constructor(private readonly taskTrackerService: TaskTrackerService) {}

    @Get('checkTasks')
    checkTasks(): IApiResponse {
        return this.taskTrackerService.checkTasks();
    }
}
