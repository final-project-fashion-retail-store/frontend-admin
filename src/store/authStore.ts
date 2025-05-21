import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { UserType } from '@/types';
import { setRefreshTokenFunction } from '@/utils/axios';
import { getCurrentUser, login } from '@/services';

type LoginType = {
	email: string;
	password: string;
};

type Store = {
	authUser: UserType | null;
	isCheckingAuth: boolean;
	isLoggingIn: boolean;
	isLoggingOut: boolean;

	checkAuth: () => void;
	login: (data: LoginType) => Promise<void | string>;
	logout: () => void;
	refreshAccessToken: () => void;
};

// New refresh token service
export const refreshToken = async () => {
	try {
		const res = await axios.post(
			`${import.meta.env.VITE_BASE_URL}auth/refresh-token`,
			{ refreshToken },
			{
				// Skip interceptor for this request to avoid loops
				headers: {
					skipAuthRefresh: 'true',
					'Content-Type': 'application/json',
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
	isCheckingAuth: false,
	isLoggingIn: false,
	isLoggingOut: false,

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
	async logout() {},
	async refreshAccessToken() {
		const res = await refreshToken();
		if (!res) {
			throw new Error('Failed to refresh token');
		}
	},
}));

setRefreshTokenFunction(useAuthStore.getState().refreshAccessToken);

export default useAuthStore;
