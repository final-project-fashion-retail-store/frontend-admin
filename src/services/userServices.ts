import type { AddressSendType } from '@/types';
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

export const logout = async () => {
	try {
		await instance.delete('auth/logout');
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const forgotPassword = async (data: { email: string }) => {
	try {
		const res = await instance.post('auth/forgot-password', data);

		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const resetPassword = async (
	data: {
		password: string;
		passwordConfirm: string;
	},
	resetPasswordToken: string
) => {
	try {
		const res = await instance.patch(
			`auth/reset-password/${resetPasswordToken}`,
			data
		);

		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const updateProfile = async (data: {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	avatar?: { url: string; public_id: string };
}) => {
	try {
		const res = await instance.patch('users/edit-profile', data);

		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const changePassword = async (data: {
	oldPassword: string;
	newPassword: string;
	passwordConfirm: string;
}) => {
	try {
		const res = await instance.patch('auth/change-password', data);

		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createAddress = async (data: AddressSendType) => {
	try {
		const res = await instance.post('users/add-address', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};
