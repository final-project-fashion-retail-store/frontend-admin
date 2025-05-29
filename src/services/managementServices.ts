import type { UserSendType } from '@/types';
import instance from '@/utils/axios';
import { isAxiosError } from 'axios';

// User
export const getAllUsers = async (
	role?: 'user' | 'staff',
	searchValue?: string,
	active?: boolean | '',
	sort?: string | '',
	paginationLink?: string
) => {
	try {
		const res = await instance.get(
			paginationLink ||
				`/users?userManageSearch=${searchValue}&role=${role}&active=${active}&sort=${sort}&limit=5`
		);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const getUser = async (id: string) => {
	try {
		const res = await instance.get(`/users/${id}`);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createUser = async (data: UserSendType) => {
	try {
		const res = await instance.post('/users', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const updateUser = async (id: string, data: UserSendType) => {
	try {
		const res = await instance.patch(`/users/${id}`, data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const deactivateUserAccount = async (id: string) => {
	try {
		// todo
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const completelyDeleteUserAccount = async (id: string) => {
	try {
		await instance.delete(`/users/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};
