import { Module } from '@nestjs/common';
import { TaskTrackerController } from './controllers/task-tracker.controller';
import { TaskTrackerService } from './services/task-tracker.service';

@Module({
    controllers: [TaskTrackerController],
    providers: [TaskTrackerService],
})
export class TaskTrackerModule {}
