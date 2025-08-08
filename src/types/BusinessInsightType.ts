export type BusinessInsightType = {
	totalRevenue: {
		value: number;
		change: number;
	};
	totalOrders: {
		value: number;
		change: number;
	};
	activeUsers: {
		value: number;
	};
	avgOrderValue: {
		value: number;
		change: number;
	};
	totalProfit: number;
	profitMargin: string;
};
