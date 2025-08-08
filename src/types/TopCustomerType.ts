export type TopCustomerType = {
	totalOrders: number;
	totalSpent: number;
	lastOrderDate: string;
	customerId: string;
	email: string;
	avgOrderValue: number;
	ltv: number;
	rank: number;
	daysSinceLastOrder: number;
	segment: string;
};
