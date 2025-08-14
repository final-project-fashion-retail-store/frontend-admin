import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';

import type { UserType } from '@/types';
import { setRefreshTokenFunction } from '@/utils/axios';
import {
	changePassword,
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
	isChangingPassword: boolean;
	onlineUsers: string[];
	socket: Socket | null;

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
		avatar?: { url: string; public_id: string };
	}) => Promise<void | string>;
	changePassword: (data: {
		oldPassword: string;
		newPassword: string;
		passwordConfirm: string;
	}) => Promise<void | string>;
	connectSocket: () => void;
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

const useAuthStore = create<Store>((set, get) => ({
	authUser: null,
	isCheckingAuth: true,
	isLoggingIn: false,
	isLoggingOut: false,
	isSendingEmail: false,
	isResettingPassword: false,
	isUpdatingProfile: false,
	isChangingPassword: false,
	onlineUsers: [],
	socket: null,

	async checkAuth() {
		try {
			set({ isCheckingAuth: true });
			const res = await getCurrentUser();
			console.log('Current user:', res.data.user);
			set({ authUser: res.data.user });
			get().connectSocket();
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
				// setTimeout(() => {
				// 	window.location.href = '/';
				// }, 2000);
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
		try {
			await refreshToken();
		} catch {
			set({ authUser: null });
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

	async changePassword(data) {
		try {
			set({ isChangingPassword: true });
			const res = await changePassword(data);
			if (res) {
				toast.success('Password changed successfully');
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to change password');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isChangingPassword: false });
		}
	},

	connectSocket() {
		const { authUser, socket } = get();

		// Don't connect if no user or already connected
		if (!authUser || (socket && socket.connected)) {
			console.log('❌ Not connecting socket - no user or already connected');
			return;
		}

		// Disconnect existing socket first
		if (socket) {
			console.log('🔌 Disconnecting existing socket before reconnecting');
			socket.disconnect();
		}

		console.log('🔌 Connecting socket for user:', authUser._id);

		const newSocket = io('https://api.purplebee.store', {
			query: {
				userId: authUser._id,
			},
			// Force new connection to avoid reusing old connections
			forceNew: true,
			// Reconnection settings
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			// Transport settings
			transports: ['websocket', 'polling'],
		});

		// Connection event handlers
		newSocket.on('connect', () => {
			console.log('✅ Socket connected:', newSocket.id);
		});

		newSocket.on('disconnect', (reason) => {
			console.log('❌ Socket disconnected:', reason);
		});

		newSocket.on('connect_error', (error) => {
			console.error('🔌 Socket connection error:', error);
		});

		newSocket.on('getOnlineUsers', (userIds: string[]) => {
			console.log('👥 Online users updated:', userIds);
			set({ onlineUsers: userIds });
		});

		// Test connection
		newSocket.emit('ping', 'test from frontend');
		newSocket.on('pong', (data) => {
			console.log('🏓 Pong received:', data);
		});

		set({ socket: newSocket });
	},

	disconnectSocket: () => {
		const socket = get().socket;
		if (socket) {
			console.log('🔌 Manually disconnecting socket:', socket.id);
			socket.disconnect();
			set({ socket: null, onlineUsers: [] });
		}
	},
}));

setRefreshTokenFunction(useAuthStore.getState().refreshAccessToken);

export default useAuthStore;
