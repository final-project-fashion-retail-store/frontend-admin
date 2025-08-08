import instance from '@/utils/axios';
import { isAxiosError } from 'axios';

export const getBusinessInsights = async (period: string) => {
	try {
		const response = await instance.get(`analytics/overview?period=${period}`);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getRevenueTrends = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/revenue-trends?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getPaymentMethods = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/payment-methods?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getOrderStatus = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/order-status?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getTopProducts = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/top-products?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

// user
export const getUserActivity = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/user-activity?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getOrderByLocation = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/orders-by-location?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getTopCustomers = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/top-customers?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

// sales
export const getCategoryPerformance = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/category-performance?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getProfitMargin = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/profit-margins?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getECommerceMetrics = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/ecommerce-metrics?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getProductRevenue = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/product-revenue?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getProductRatings = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/product-ratings?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getWishlistConversion = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/wishlist-conversion?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getInventoryMetrics = async (period: string) => {
	try {
		const response = await instance.get(
			`analytics/inventory-metrics?period=${period}`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};

export const getInventoryStatus = async (link: string) => {
	try {
		const response = await instance.get(
			link || `analytics/inventory-status?limit=10`
		);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) throw error;
	}
};
