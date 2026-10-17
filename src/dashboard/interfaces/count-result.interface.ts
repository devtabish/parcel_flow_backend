interface ICountResult {
    count: number;
}

interface ISalesByProduct {
    productName: string;
    quantity: number;
    revenue: number;
}

interface ISalesByOverview {
    month: string;
    sales: string;
}

interface IRecentOrders {
    _id: string;
    fullName: string;
    email: string;
    tatolAmount: number;
}

export interface ISalesDashboardAggregationResult {
    totalSales: ICountResult[];
    onlineSales: ICountResult[];
    grossRevenue: ICountResult[];
    salesOverview: ISalesByOverview[];
    salesByProduct: ISalesByProduct[];
    recentOrders: IRecentOrders[];
}
