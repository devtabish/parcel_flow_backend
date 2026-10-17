import { Module } from '@nestjs/common';
import { ApiCallService } from './services/api-call.service';
import { HttpModule } from '@nestjs/axios';
import { ApiCallWithThrowService } from './services/api-call-with-throw.service';

@Module({
    imports: [HttpModule],
    providers: [ApiCallService, ApiCallWithThrowService],
    exports: [ApiCallService, ApiCallWithThrowService],
})
export class ApiCallModule {}
