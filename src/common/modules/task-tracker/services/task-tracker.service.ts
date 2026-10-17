import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class TaskTrackerService {
    private readonly runningTasks = new Set<string>();

    addTask(): string {
        const taskId = randomUUID();

        this.runningTasks.add(taskId);

        return taskId;
    }

    removeTask(taskId: string): void {
        this.runningTasks.delete(taskId);
    }

    checkTasks(): IApiResponse {
        const runningTasks = this.runningTasks.size;
        if (runningTasks > 0) throw new BadRequestException('Server Busy');

        return { success: true, message: 'Server is not busy' };
    }
}
