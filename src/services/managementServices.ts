import type { AddressSendType, UserSendType } from '@/types';
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

export const completelyDeleteUserAccount = async (id: string) => {
	try {
		await instance.delete(`/users/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

// Address (Cuz address in user management, so writing call API of it here)
export const getAllAddresses = async (
	searchValue: string,
	active: boolean | '',
	sort: string,
	paginationLink: string
) => {
	try {
		const res = await instance.get(
			paginationLink ||
				`/addresses?addressManageSearch=${searchValue}&active=${active}&sort=${sort}&paginationLink=${paginationLink}&limit=5`
		);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const getAddress = async (id: string) => {
	try {
		const res = await instance.get(`/addresses/${id}`);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createAddress = async (data: AddressSendType) => {
	try {
		const res = await instance.post('/addresses', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const editAddress = async (id: string, data: AddressSendType) => {
	try {
		const res = await instance.patch(`/addresses/${id}`, data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const completelyDeleteAddress = async (id: string) => {
	try {
		await instance.delete(`/addresses/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

// Purpose is to delete all addresses of a user when the user is deleted completely
export const completelyDeleteAddresses = async (userId: string) => {
	try {
		await instance.delete(`/addresses/delete-addresses/${userId}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};
