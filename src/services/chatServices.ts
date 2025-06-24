import instance from '@/utils/axios';
import { isAxiosError } from 'axios';

export const getUserChatSidebar = async () => {
	try {
		const response = await instance.get('messages/users-in-sidebar');
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			throw error;
		}
	}
};

export const getMessages = async (customerId: string) => {
	try {
		const response = await instance.get(`messages/${customerId}`);
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			throw error;
		}
	}
};

export const sendMessage = async (customerId: string, message: string) => {
	try {
		const response = await instance.post(`messages/${customerId}`, {
			text: message,
		});
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			throw error;
		}
	}
};

export const readMessages = async (customerId: string) => {
	try {
		await instance.patch(`messages/${customerId}`);
	} catch (error) {
		if (isAxiosError(error)) {
			throw error;
		}
	}
};
