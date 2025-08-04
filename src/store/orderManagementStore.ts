import { getAllOrders, updateOrder } from '@/services';
import type { OrderType, PaginationType } from '@/types';
import { AxiosError } from 'axios';
import { create } from 'zustand';

type Stores = {
	orders: OrderType[];
	selectedOrder: OrderType | null;
	pagination: PaginationType | null;

	isGettingOrder: boolean;
	isUpdatingOrder: boolean;

	getOrders: (
		searchValue?: string,
		paymentStatus?: string,
		orderStatus?: string,
		sort?: string,
		paginationLink?: string
	) => void;
	updateOrder: (
		id: string,
		status: string
	) => Promise<{ success: boolean; message?: string }>;
	setSelectedOrder: (order: OrderType | null) => void;
};

const useOrderManagementStore = create<Stores>((set) => ({
	orders: [],
	selectedOrder: null,
	pagination: null,
	isGettingOrder: false,
	isUpdatingOrder: false,

	async getOrders(
		searchValue = '',
		paymentStatus = '',
		orderStatus = '',
		sort = '',
		paginationLink = ''
	) {
		try {
			set({ isGettingOrder: true });
			const res = await getAllOrders(
				searchValue,
				paymentStatus,
				orderStatus,
				sort,
				paginationLink
			);
			console.log(res.data.pagination);
			set({ orders: res.data.data, pagination: res.data.pagination });
		} catch (err) {
			console.log(err);
		} finally {
			set({ isGettingOrder: false });
		}
	},

	async updateOrder(id, status) {
		try {
			set({ isUpdatingOrder: true });
			await updateOrder(id, status);

			set((state) => ({
				orders: state.orders.map((order) =>
					order._id === id ? { ...order, status } : order
				),
			}));

			return { success: true, message: 'Changed status successfully' };
		} catch (err) {
			if (err instanceof AxiosError) {
				return {
					success: false,
					message: err.response?.data.message || 'Failed to update order',
				};
			}

			return { success: false, message: 'An unexpected error occurred' };
		} finally {
			set({ isUpdatingOrder: false });
		}
	},

	setSelectedOrder(order) {
		set({ selectedOrder: order });
	},
}));

export default useOrderManagementStore;
