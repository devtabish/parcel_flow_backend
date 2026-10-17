// import { Injectable } from '@nestjs/common';
// import { IApiResponse } from 'src/common/interfaces/response.interface';
// import { OrderRepositoryService } from 'src/order/services/order-repository.service';
// import { PipelineStage } from 'mongoose';
// import { EOrderStatus } from 'src/order/enums/order-status.enum';
// import { EPaymentMethod } from 'src/order/enums/payment-method.enum';
// import { GetSalesManagementDto } from '../dto/get-sales.dto';
// import { IRecentOrderMatch } from '../interfaces/recent-order-match.interface';
// import { ISalesDashboardAggregationResult } from '../interfaces/count-result.interface';
// import { IMatchStage } from '../interfaces/match-stage.interface';
// import { IIncomeOverview } from '../interfaces/income-overview.interface';

// @Injectable()
// export class DashboardService {
//     constructor(private readonly orderRepositoryService: OrderRepositoryService) {}

//     async getCustomerDashboard(): Promise<IApiResponse> {
//         const data = await this.userRepositoryService.aggregate([
//             {
//                 $facet: {
//                     totalCustomers: [
//                         {
//                             $count: 'count',
//                         },
//                     ],

//                     newCustomers: [
//                         {
//                             $match: {
//                                 createdAt: {
//                                     $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//                                 },
//                             },
//                         },
//                         {
//                             $count: 'count',
//                         },
//                     ],

//                     customerGrowth: [
//                         {
//                             $group: {
//                                 _id: {
//                                     year: {
//                                         $year: '$createdAt',
//                                     },
//                                     month: {
//                                         $month: '$createdAt',
//                                     },
//                                 },
//                                 totalCustomers: {
//                                     $sum: 1,
//                                 },
//                             },
//                         },
//                         {
//                             $sort: {
//                                 '_id.year': 1,
//                                 '_id.month': 1,
//                             },
//                         },
//                     ],
//                     recentCustomers: [
//                         {
//                             $sort: {
//                                 createdAt: -1,
//                             },
//                         },
//                         {
//                             $limit: 5,
//                         },
//                     ],
//                 },
//             },
//         ]);

//         return {
//             message: 'customer dashboard fetched successfully',
//             data: data[0],
//         };
//     }

//     async getSalesManagementDashboard(payload: GetSalesManagementDto): Promise<IApiResponse> {
//         const { startDate, endDate, search } = payload;
//         const matchStage: IMatchStage = {};
//         if (startDate || endDate) {
//             matchStage.createdAt = {};
//             if (startDate) matchStage.createdAt.$gte = new Date(startDate);
//             if (endDate) matchStage.createdAt.$lte = new Date(endDate);
//         }

//         const recentOrdersMatch: IRecentOrderMatch = {};
//         if (search) {
//             recentOrdersMatch.$or = [
//                 { _id: { $regex: search, $options: 'i' } },
//                 { fullName: { $regex: search, $options: 'i' } },
//                 { email: { $regex: search, $options: 'i' } },
//             ];
//         }

//         const pipeline: PipelineStage[] = [
//             { $match: matchStage },
//             {
//                 $facet: {
//                     totalSales: [{ $match: { orderStatus: EOrderStatus.DELIVERED } }, { $group: { _id: null, count: { $sum: '$totalAmount' } } }],

//                     onlineSales: [
//                         {
//                             $match: {
//                                 orderStatus: EOrderStatus.DELIVERED,
//                                 paymentMethod: { $ne: EPaymentMethod.COD },
//                             },
//                         },
//                         { $group: { _id: null, count: { $sum: '$totalAmount' } } },
//                     ],

//                     grossRevenue: [
//                         {
//                             $match: {
//                                 orderStatus: { $ne: EOrderStatus.CANCELLED },
//                             },
//                         },
//                         { $group: { _id: null, count: { $sum: '$totalAmount' } } },
//                     ],

//                     salesOverview: [
//                         { $match: { orderStatus: EOrderStatus.DELIVERED } },
//                         {
//                             $group: {
//                                 _id: { $month: '$createdAt' },
//                                 totalAmount: { $sum: '$totalAmount' },
//                             },
//                         },
//                         { $sort: { _id: 1 } },
//                     ],

//                     salesByProduct: [
//                         {
//                             $match: {
//                                 name: { $exists: true, $ne: null },
//                             },
//                         },

//                         // { $unwind: { path: '$productIds', preserveNullAndEmptyArrays: true } },

//                         {
//                             $group: {
//                                 _id: { $ifNull: ['$productId', '$productIds'] },
//                                 productName: { $first: '$name' },
//                                 totalSales: { $sum: { $ifNull: ['$quantities', 1] } },
//                                 totalRevenue: { $sum: '$totalAmount' },
//                             },
//                         },
//                         { $sort: { totalSales: -1 } },
//                         { $limit: 4 },
//                     ],

//                     recentOrders: [{ $match: recentOrdersMatch }, { $sort: { createdAt: -1 } }, { $limit: 5 }],
//                 },
//             },
//         ];

//         const [data] = await this.orderRepositoryService.aggregate<ISalesDashboardAggregationResult>(pipeline);

//         return {
//             message: 'sales management dashboard fetched successfully',
//             data: {
//                 cards: {
//                     totalSales: data?.totalSales?.[0]?.count || 0,
//                     onlineSales: data?.onlineSales?.[0]?.count || 0,
//                     grossRevenue: data?.grossRevenue?.[0]?.count || 0,
//                 },
//                 salesOverview: data?.salesOverview || [],
//                 salesByProduct: data?.salesByProduct || [],
//                 recentOrders: data?.recentOrders || [],
//             },
//         };
//     }

//     async getIncomeOverviewDashboard(): Promise<IApiResponse> {
//         const now = new Date();

//         const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//         const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

//         const currentDay = now.getDay();
//         const startOfThisWeek = new Date(now);
//         startOfThisWeek.setDate(now.getDate() - currentDay);
//         startOfThisWeek.setHours(0, 0, 0, 0);

//         const startOfLastWeek = new Date(startOfThisWeek);
//         startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
//         const endOfLastWeek = new Date(startOfThisWeek);

//         const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//         const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

//         const pipeline: PipelineStage[] = [
//             {
//                 $facet: {
//                     totalIncome: [{ $match: { orderStatus: EOrderStatus.DELIVERED } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }],

//                     todaysIncome: [
//                         {
//                             $match: {
//                                 orderStatus: EOrderStatus.DELIVERED,
//                                 createdAt: { $gte: startOfToday, $lt: endOfToday },
//                             },
//                         },
//                         { $group: { _id: null, total: { $sum: '$totalAmount' } } },
//                     ],

//                     thisWeekIncome: [
//                         {
//                             $match: {
//                                 orderStatus: EOrderStatus.DELIVERED,
//                                 createdAt: { $gte: startOfThisWeek },
//                             },
//                         },
//                         { $group: { _id: null, total: { $sum: '$totalAmount' } } },
//                     ],

//                     lastWeekIncome: [
//                         {
//                             $match: {
//                                 orderStatus: EOrderStatus.DELIVERED,
//                                 createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek },
//                             },
//                         },
//                         { $group: { _id: null, total: { $sum: '$totalAmount' } } },
//                     ],

//                     lastMonthIncome: [
//                         {
//                             $match: {
//                                 orderStatus: EOrderStatus.DELIVERED,
//                                 createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
//                             },
//                         },
//                         { $group: { _id: null, total: { $sum: '$totalAmount' } } },
//                     ],

//                     incomeOverTime: [
//                         { $match: { orderStatus: EOrderStatus.DELIVERED } },
//                         {
//                             $group: {
//                                 _id: { $month: '$createdAt' },
//                                 totalAmount: { $sum: '$totalAmount' },
//                             },
//                         },
//                         { $sort: { _id: 1 } },
//                     ],
//                 },
//             },
//         ];

//         const [data] = await this.orderRepositoryService.aggregate<IIncomeOverview>(pipeline);

//         return {
//             message: 'income overview fetched successfully',
//             data: {
//                 totalIncome: data?.totalIncome?.[0]?.total || 0,
//                 todaysIncome: data?.todaysIncome?.[0]?.total || 0,
//                 thisWeek: data?.thisWeekIncome?.[0]?.total || 0,
//                 lastWeek: data?.lastWeekIncome?.[0]?.total || 0,
//                 lastMonth: data?.lastMonthIncome?.[0]?.total || 0,
//                 incomeOverTime: data?.incomeOverTime || [],
//             },
//         };
//     }
// }
