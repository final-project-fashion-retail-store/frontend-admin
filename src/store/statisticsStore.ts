import {
	getBusinessInsights,
	getCategoryPerformance,
	getECommerceMetrics,
	getInventoryMetrics,
	getInventoryStatus,
	getOrderByLocation,
	getOrderStatus,
	getPaymentMethods,
	getProductRatings,
	getProductRevenue,
	getProfitMargin,
	getRevenueTrends,
	getTopCustomers,
	getTopProducts,
	getUserActivity,
	getWishlistConversion,
} from '@/services/statisticsServices';
import type {
	BusinessInsightType,
	CategoryPerformanceType,
	ECommerceMetricType,
	InventoryMetricsType,
	InventoryStatusType,
	OrderByLocationType,
	OrderStatusType,
	PaginationType,
	PaymentMethodType,
	ProductRatingType,
	ProductRevenueType,
	ProfitMarginType,
	RevenueTrendType,
	TopCustomerType,
	TopProductType,
	UserActivityType,
	WishlistConversionType,
} from '@/types';
import { create } from 'zustand';

type Stores = {
	insights: BusinessInsightType | null;
	revenueTrends: RevenueTrendType[] | null;
	paymentMethods: PaymentMethodType[] | null;
	orderStatus: OrderStatusType[] | null;
	topProducts: TopProductType[] | null;
	// user
	userActivities: UserActivityType[] | null;
	orderByLocation: OrderByLocationType[] | null;
	topCustomers: TopCustomerType[] | null;
	// sales
	categoryPerformances: CategoryPerformanceType[] | null;
	ProfitMargins: ProfitMarginType[] | null;
	eCommerceMetrics: ECommerceMetricType | null;
	// product
	productRevenue: ProductRevenueType[] | null;
	productRatings: ProductRatingType[] | null;
	wishlistConversion: WishlistConversionType | null;
	// inventory
	inventoryMetrics: InventoryMetricsType | null;
	inventoryStatus: InventoryStatusType[] | null;
	period: string;
	pagination: PaginationType | null;

	isGettingInsights: boolean;
	isGettingRevenueTrends: boolean;
	isGettingPaymentMethods: boolean;
	isGettingOrderStatus: boolean;
	isGettingTopProducts: boolean;
	isGettingUserActivities: boolean;
	isGettingOrderByLocation: boolean;
	isGettingTopCustomers: boolean;
	isGettingCategoryPerformances: boolean;
	isGettingProfitMargins: boolean;
	isGettingProductRevenue: boolean;
	isGettingProductRatings: boolean;
	isGettingWishlistConversion: boolean;
	isGettingInventoryMetrics: boolean;
	isGettingInventoryStatus: boolean;

	getInsights: (period: string) => void;
	getRevenueTrends: (period: string) => void;
	getPaymentMethods: (period: string) => void;
	getOrderStatus: (period: string) => void;
	getTopProducts: (period: string) => void;
	// user
	getUserActivities: (period: string) => void;
	getOrderByLocation: (period: string) => void;
	getTopCustomers: (period: string) => void;
	// sales
	getCategoryPerformances: (period: string) => void;
	getProfitMargins: (period: string) => void;
	getECommerceMetrics: (period: string) => void;
	setPeriod: (period: string) => void;
	// product
	getProductRevenue: (period: string) => void;
	getProductRatings: (period: string) => void;
	getWishlistConversion: (period: string) => void;
	// Inventory
	getInventoryMetrics: (period: string) => void;
	getInventoryStatus: (link?: string) => void;
};

const useStatisticsStore = create<Stores>((set) => ({
	insights: null,
	revenueTrends: null,
	paymentMethods: null,
	orderStatus: null,
	topProducts: null,
	// user
	userActivities: null,
	orderByLocation: null,
	topCustomers: null,
	// sales
	categoryPerformances: null,
	ProfitMargins: null,
	eCommerceMetrics: null,
	// product
	productRevenue: null,
	productRatings: null,
	wishlistConversion: null,
	// inventory
	inventoryMetrics: null,
	inventoryStatus: null,
	period: '6months',
	pagination: null,

	isGettingInsights: false,
	isGettingRevenueTrends: false,
	isGettingPaymentMethods: false,
	isGettingOrderStatus: false,
	isGettingTopProducts: false,
	isGettingUserActivities: false,
	isGettingOrderByLocation: false,
	isGettingTopCustomers: false,
	isGettingCategoryPerformances: false,
	isGettingProfitMargins: false,
	isGettingProductRevenue: false,
	isGettingProductRatings: false,
	isGettingWishlistConversion: false,
	isGettingInventoryMetrics: false,
	isGettingInventoryStatus: false,

	async getInsights(period) {
		try {
			set({ isGettingInsights: true });
			const res = await getBusinessInsights(period);
			set({ insights: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingInsights: false });
		}
	},

	async getRevenueTrends(period) {
		try {
			set({ isGettingRevenueTrends: true });
			const res = await getRevenueTrends(period);
			set({ revenueTrends: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingRevenueTrends: false });
		}
	},

	async getPaymentMethods(period) {
		try {
			set({ isGettingPaymentMethods: true });
			const res = await getPaymentMethods(period);
			set({ paymentMethods: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingPaymentMethods: false });
		}
	},

	async getOrderStatus(period) {
		try {
			set({ isGettingOrderStatus: true });
			const res = await getOrderStatus(period);
			set({ orderStatus: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingOrderStatus: false });
		}
	},

	async getTopProducts(period) {
		try {
			set({ isGettingTopProducts: true });
			const res = await getTopProducts(period);
			set({ topProducts: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingTopProducts: false });
		}
	},

	setPeriod(period) {
		set({ period });
	},

	async getUserActivities(period) {
		try {
			set({ isGettingUserActivities: true });
			const res = await getUserActivity(period);
			set({ userActivities: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingUserActivities: false });
		}
	},

	async getOrderByLocation(period) {
		try {
			set({ isGettingOrderByLocation: true });
			const res = await getOrderByLocation(period);
			set({ orderByLocation: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingOrderByLocation: false });
		}
	},

	async getTopCustomers(period) {
		try {
			set({ isGettingTopCustomers: true });
			const res = await getTopCustomers(period);
			set({ topCustomers: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingTopCustomers: false });
		}
	},

	async getCategoryPerformances(period) {
		try {
			set({ isGettingCategoryPerformances: true });
			const res = await getCategoryPerformance(period);
			set({ categoryPerformances: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingCategoryPerformances: false });
		}
	},

	async getProfitMargins(period) {
		try {
			set({ isGettingProfitMargins: true });
			const res = await getProfitMargin(period);
			set({ ProfitMargins: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingProfitMargins: false });
		}
	},

	async getECommerceMetrics(period) {
		try {
			const res = await getECommerceMetrics(period);
			set({ eCommerceMetrics: res.data });
		} catch (err) {
			console.log(err);
		}
	},

	async getProductRevenue(period) {
		try {
			set({ isGettingProductRevenue: true });
			const res = await getProductRevenue(period);
			set({ productRevenue: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingProductRevenue: false });
		}
	},

	async getProductRatings(period) {
		try {
			set({ isGettingProductRatings: true });
			const res = await getProductRatings(period);
			set({ productRatings: res.data.distribution });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingProductRatings: false });
		}
	},

	async getWishlistConversion(period) {
		try {
			set({ isGettingWishlistConversion: true });
			const res = await getWishlistConversion(period);
			set({ wishlistConversion: res.data.summary });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingWishlistConversion: false });
		}
	},

	async getInventoryMetrics(period) {
		try {
			set({ isGettingInventoryMetrics: true });
			const res = await getInventoryMetrics(period);
			set({ inventoryMetrics: res.data });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingInventoryMetrics: false });
		}
	},

	async getInventoryStatus(link = '') {
		try {
			set({ isGettingInventoryStatus: true });
			const res = await getInventoryStatus(link);

			if (link) {
				set((state) => ({
					inventoryStatus: [...(state.inventoryStatus || []), ...res.data],
					pagination: res.pagination,
				}));
				return;
			}

			set({ inventoryStatus: res.data, pagination: res.pagination });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingInventoryStatus: false });
		}
	},
}));

export default useStatisticsStore;
