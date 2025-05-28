import {
	completelyDeleteUserAccount,
	createUser,
	getAllUsers,
	updateUser,
} from '@/services';
import type { PaginationType, UserSendType, UserType } from '@/types';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';

type Store = {
	users: UserType[] | null;
	selectedUser: UserType | null;
	pagination: PaginationType | null;
	isGettingUser: boolean;
	isCreatingUser: boolean;
	isUpdatingUser: boolean;
	isDeletingUser: boolean;

	getAllUsers: (
		role?: 'user' | 'staff',
		searchValue?: string,
		active?: boolean | '',
		sort?: string | '',
		paginationLink?: string
	) => void;
	createUser: (data: UserSendType) => void;
	updateUser: (id: string, data: UserSendType) => void;
	deleteUser: (id: string) => void;
};

const useManagementStore = create<Store>((set) => ({
	users: null,
	selectedUser: null,
	pagination: null,
	isGettingUser: false,
	isCreatingUser: false,
	isUpdatingUser: false,
	isDeletingUser: false,

	async createUser(data) {
		set({ isCreatingUser: true });
		try {
			const res = await createUser(data);
			console.log(res);
			toast.success('User created successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				toast.error('Failed to create user');
			}
		} finally {
			set({ isCreatingUser: false });
		}
	},

	async getAllUsers(
		role,
		searchValue = '',
		active = '',
		sort = '',
		paginationLink = ''
	) {
		set({ isGettingUser: true });
		try {
			const res = await getAllUsers(
				role,
				searchValue,
				active,
				sort,
				paginationLink
			);
			set({ users: res.data.data, pagination: res.data.pagination });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingUser: false });
		}
	},

	async updateUser(id, data) {
		set({ isUpdatingUser: true });
		try {
			const res = await updateUser(id, data);
			set({ selectedUser: res.data.data });
			toast.success('User updated successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				toast.error('Failed to update user');
			}
		} finally {
			set({ isUpdatingUser: false });
		}
	},

	async deleteUser(id) {
		set({ isDeletingUser: true });
		try {
			await completelyDeleteUserAccount(id);
			toast.success('User deleted successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				toast.error('Failed to deleted user');
			}
		} finally {
			set({ isDeletingUser: false });
		}
	},
}));

export default useManagementStore;
