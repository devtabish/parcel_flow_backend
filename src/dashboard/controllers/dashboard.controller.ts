// import { Controller, Get, Query, UseGuards } from '@nestjs/common';
// import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
// import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { ERoles } from 'src/common/enums/roles.enum';
// import { IApiResponse } from 'src/common/interfaces/response.interface';
// import { GetSalesManagementDto } from '../dto/get-sales.dto';

// @StrictValidation()
// @UseGuards(AdminAuthGuard, RolesGuard)
// @Controller('admin/dashboard')
// export class DashboardController {
//     constructor(private readonly dashboardService: DashboardService) {}

//     @Roles(ERoles.ADMINISTRATOR)
//     @Get('customer-management')
//     async getCustomerDashboard(): Promise<IApiResponse> {
//         return await this.dashboardService.getCustomerDashboard();
//     }

//     @Roles(ERoles.ADMINISTRATOR)
//     @Get('sales-management')
//     async getSalesManagement(@Query() payload: GetSalesManagementDto): Promise<IApiResponse> {
//         return await this.dashboardService.getSalesManagementDashboard(payload);
//     }

//     @Roles(ERoles.ADMINISTRATOR)
//     @Get('income-overview')
//     async getIncomeOverview(): Promise<IApiResponse> {
//         return await this.dashboardService.getIncomeOverviewDashboard();
//     }
// }
