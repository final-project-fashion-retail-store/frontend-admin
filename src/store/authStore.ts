import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { UserType } from '@/types';
import { setRefreshTokenFunction } from '@/utils/axios';
import {
	forgotPassword,
	getCurrentUser,
	login,
	logout,
	resetPassword,
	updateProfile,
} from '@/services';

type LoginType = {
	email: string;
	password: string;
};

type Store = {
	authUser: UserType | null;
	isCheckingAuth: boolean;
	isLoggingIn: boolean;
	isLoggingOut: boolean;
	isSendingEmail: boolean;
	isResettingPassword: boolean;
	isUpdatingProfile: boolean;

	checkAuth: () => void;
	login: (data: LoginType) => Promise<void | string>;
	logout: () => void;
	refreshAccessToken: () => void;
	forgotPassword: (data: { email: string }) => Promise<void | string>;
	resetPassword: (
		data: { password: string; passwordConfirm: string },
		resetPasswordToken: string
	) => Promise<void | string>;
	updateProfile: (data: {
		firstName?: string;
		lastName?: string;
		phoneNumber?: string;
	}) => Promise<void | string>;
};

// New refresh token service
export const refreshToken = async () => {
	try {
		const res = await axios.get(
			`${import.meta.env.VITE_BASE_URL}auth/refresh-token`,
			{
				// Skip interceptor for this request to avoid loops
				headers: {
					skipAuthRefresh: true,
					'x-api-key': import.meta.env.VITE_X_API_KEY,
				},
				withCredentials: true,
			}
		);
		return res;
	} catch (err) {
		if (err instanceof AxiosError) throw err;
	}
};

const useAuthStore = create<Store>((set) => ({
	authUser: null,
	isCheckingAuth: true,
	isLoggingIn: false,
	isLoggingOut: false,
	isSendingEmail: false,
	isResettingPassword: false,
	isUpdatingProfile: false,

	async checkAuth() {
		try {
			set({ isCheckingAuth: true });
			const res = await getCurrentUser();
			if (res) {
				set({ authUser: res.data.user });
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err?.response?.data?.message);
				console.log(err);
			}
		} finally {
			set({ isCheckingAuth: false });
		}
	},
	async login(data) {
		try {
			set({ isLoggingIn: true });
			const res = await login(data);
			if (res) {
				toast.success('Login successful');
				setTimeout(() => {
					window.location.href = '/';
				}, 2000);
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Login failed');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isLoggingIn: false });
		}
	},
	async logout() {
		try {
			set({ isLoggingOut: true });
			await logout();
			set({ authUser: null });
			toast.success('Logout successful');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Logout failed');
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isLoggingOut: false });
		}
	},
	async refreshAccessToken() {
		const res = await refreshToken();
		if (!res) {
			throw new Error('Failed to refresh token');
		}
	},
	async forgotPassword(email) {
		try {
			set({ isSendingEmail: true });
			const res = await forgotPassword(email);
			if (res) {
				toast.success('Email sent successfully');
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to send email');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isSendingEmail: false });
		}
	},

	async resetPassword(data, resetPasswordToken) {
		try {
			set({ isResettingPassword: true });
			await resetPassword(data, resetPasswordToken);
			toast.success('Password reset successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to reset password');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isResettingPassword: false });
		}
	},
	async updateProfile(data) {
		try {
			set({ isUpdatingProfile: true });
			const res = await updateProfile(data);
			if (res) {
				console.log(res);
				toast.success('Profile updated successfully');
				set({ authUser: res.data.user });
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to update profile');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isUpdatingProfile: false });
		}
	},
}));

setRefreshTokenFunction(useAuthStore.getState().refreshAccessToken);

export default useAuthStore;
