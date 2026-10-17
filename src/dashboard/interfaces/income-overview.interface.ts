interface IIncomeResult {
    total: number;
}
interface IIncomeOverTime {
    date: string;
    income: number;
}

export interface IIncomeOverview {
    totalIncome: IIncomeResult[];
    todaysIncome: IIncomeResult[];
    thisWeekIncome: IIncomeResult[];
    lastWeekIncome: IIncomeResult[];
    lastMonthIncome: IIncomeResult[];
    incomeOverTime: IIncomeOverTime[];
}
