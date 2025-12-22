import { create } from 'zustand';
import { AxiosError } from 'axios';

import {
	getMessages,
	getUserChatSidebar,
	readMessages,
	sendMessage,
} from '@/services';
import type { MessageType, UserChatSidebarType } from '@/types';
import useAuthStore from '@/store/authStore';
// import { toast } from 'sonner';

type Store = {
	messages: MessageType[] | null;
	customers: UserChatSidebarType[] | null;
	selectedCustomer: UserChatSidebarType | null;
	isGettingMessages: boolean;
	isSendingMessage: boolean;
	isGettingCustomers: boolean;

	getMessages: (customerId: string) => void;
	sendMessage: (customerId: string, message: string) => void;
	getUserChatSidebar: () => void;
	setSelectedCustomer: (customer: UserChatSidebarType | null) => void;
	readMessages: (customerId: string) => void;
	subscribeToMessages: () => void;
	unsubscribeToMessages: () => void;
	subscribeUpdateUserSidebar: () => void;
	unsubscribeUpdateUserSidebar: () => void;
};

const useChatStore = create<Store>((set, get) => ({
	messages: null,
	customers: null,
	selectedCustomer: null,
	isGettingMessages: false,
	isSendingMessage: false,
	isGettingCustomers: false,

	async getMessages(customerId) {
		try {
			set({ isGettingMessages: true });
			const res = await getMessages(customerId);
			set({ messages: res.data.messages });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.error(err);
				console.log(err.response?.data?.message);
			}
		} finally {
			set({ isGettingMessages: false });
		}
	},

	async sendMessage(customerId, message) {
		try {
			set({ isSendingMessage: true });
			const res = await sendMessage(customerId, message);
			set((state) => ({
				messages: [...(state.messages || []), res.data.message],
			}));

			const currentCustomers = get().customers || [];
			const existingIndex = currentCustomers.findIndex(
				(c) => c._id === customerId
			);

			const foundCustomer = currentCustomers.find((c) => c._id === customerId);

			if (!foundCustomer) return;

			const updatedCustomer = { ...foundCustomer, lastMessage: message };

			let newCustomers: UserChatSidebarType[];
			if (existingIndex !== -1) {
				newCustomers = [
					updatedCustomer,
					...currentCustomers.filter((c) => c._id !== updatedCustomer._id),
				];
			} else {
				newCustomers = [updatedCustomer, ...currentCustomers];
			}

			set({ customers: newCustomers });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.error(err);
				console.log(err.response?.data?.message);
			}
		} finally {
			set({ isSendingMessage: false });
		}
	},

	setSelectedCustomer(customer) {
		set({ selectedCustomer: customer });
	},

	async getUserChatSidebar() {
		set({ isGettingCustomers: true });
		try {
			const res = await getUserChatSidebar();
			set({ customers: res.data.customers });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.error(err);
				console.log(err.response?.data?.message);
			}
		} finally {
			set({ isGettingCustomers: false });
		}
	},

	async readMessages(customerId) {
		try {
			await readMessages(customerId);

			set({
				customers: get().customers?.map((customer) =>
					customer._id === customerId ? { ...customer, isRead: true } : customer
				),
			});
		} catch (err) {
			if (err instanceof AxiosError) {
				console.error(err);
				console.log(err.response?.data?.message);
			}
		}
	},

	subscribeToMessages() {
		if (!get().selectedCustomer) return;
		const socket = useAuthStore.getState().socket;
		if (!socket) return;

		socket.on('newMessage', (newMessage) => {
			const isMessageSentFromSelectedCustomer =
				newMessage.sender === get().selectedCustomer?._id;
			if (!isMessageSentFromSelectedCustomer) return;
			// Check if the message already exists, temporary solution
			const existingMessage = get().messages?.find(
				(message) => message._id === newMessage._id
			);
			if (existingMessage) return;

			set({
				messages: [...(get().messages || []), newMessage],
			});
		});

		socket.on('sidebarReadUpdate', (customerId: string) => {
			set({
				customers: get().customers?.map((customer) =>
					customer._id === customerId ? { ...customer, isRead: true } : customer
				),
			});
		});

		socket.on('sidebarChatUpdate', (updatedCustomer: UserChatSidebarType) => {
			// console.log('📬 sidebarChatUpdate received:', updatedCustomer);
			updatedCustomer = {
				...updatedCustomer,
				isRead:
					get().selectedCustomer?._id === updatedCustomer._id
						? true
						: updatedCustomer.isRead,
			};
			const currentCustomers = get().customers || [];
			const existingIndex = currentCustomers.findIndex(
				(c) => c._id === updatedCustomer._id
			);

			let newCustomers: UserChatSidebarType[];

			if (existingIndex !== -1) {
				newCustomers = [
					updatedCustomer,
					...currentCustomers.filter((c) => c._id !== updatedCustomer._id),
				];
			} else {
				newCustomers = [updatedCustomer, ...currentCustomers];
			}

			set({ customers: newCustomers });
		});
	},

	unsubscribeToMessages() {
		const socket = useAuthStore.getState().socket;
		socket?.off('newMessage');
		socket?.off('sidebarReadUpdate');
		socket?.off('sidebarChatUpdate');
	},

	subscribeUpdateUserSidebar() {
		const socket = useAuthStore.getState().socket;
		if (!socket) {
			return;
		}

		socket.on('sidebarChatUpdate', (updatedCustomer: UserChatSidebarType) => {
			const currentCustomers = get().customers || [];
			const existingIndex = currentCustomers.findIndex(
				(c) => c._id === updatedCustomer._id
			);

			let newCustomers: UserChatSidebarType[];

			if (existingIndex !== -1) {
				newCustomers = [
					updatedCustomer,
					...currentCustomers.filter((c) => c._id !== updatedCustomer._id),
				];
			} else {
				newCustomers = [updatedCustomer, ...currentCustomers];
			}

			set({ customers: newCustomers });
		});
	},

	unsubscribeUpdateUserSidebar() {
		const socket = useAuthStore.getState().socket;
		socket?.off('sidebarChatUpdate');
	},
}));

export default useChatStore;
