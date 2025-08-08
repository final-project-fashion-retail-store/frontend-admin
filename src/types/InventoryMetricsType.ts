export type InventoryMetricsType = {
	totalInventoryValue: {
		value: number;
		formatted: string;
	};
	lowStockItems: {
		value: number;
		percentage: string;
	};
	stockTurnover: {
		value: number;
		formatted: string;
	};
	deadStock: {
		value: number;
		percentage: string;
	};
};
