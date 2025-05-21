import instance from '@/utils/axios';
import { isAxiosError } from 'axios';

export const getCurrentUser = async () => {
	try {
		const res = await instance.get('users/current-user');

		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const login = async (data: { email: string; password: string }) => {
	try {
		const res = await instance.post('auth/login', data);

		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};
