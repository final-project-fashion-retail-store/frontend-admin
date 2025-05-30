import {
	completelyDeleteAddresses,
	completelyDeleteUserAccount,
	createAddress,
	createUser,
	getAllUsers,
	updateUser,
} from '@/services';
import useGeneralStore from '@/store/generalStore';
import type {
	AddressSendType,
	PaginationType,
	UserSendType,
	UserType,
} from '@/types';
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
	isCreatingAddress: boolean;

	getAllUsers: (
		role?: 'user' | 'staff',
		searchValue?: string,
		active?: boolean | '',
		sort?: string | '',
		paginationLink?: string
	) => void;
	createUser: (data: UserSendType) => Promise<UserType>;
	updateUser: (id: string, data: UserSendType) => void;
	deleteUser: (user: UserType) => void;
	createAddress: (data: AddressSendType) => void;
};

const useManagementStore = create<Store>((set) => ({
	users: null,
	selectedUser: null,
	pagination: null,
	isGettingUser: false,
	isCreatingUser: false,
	isUpdatingUser: false,
	isDeletingUser: false,
	isCreatingAddress: false,

	async createUser(data) {
		try {
			set({ isCreatingUser: true });
			const res = await createUser(data);
			toast.success('User created successfully');
			return res.data.user;
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to create user');
				throw err;
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

	async deleteUser(user) {
		try {
			set({ isDeletingUser: true });
			const publicId = user.avatar?.public_id;
			const { destroyImages } = useGeneralStore.getState();

			// Create array of promises
			const deletePromises = [
				completelyDeleteUserAccount(user._id),
				completelyDeleteAddresses(user._id),
			];

			// Add image deletion if avatar exists
			if (publicId) {
				deletePromises.push(destroyImages({ publicId: [publicId] }));
			}

			// Execute all promises concurrently
			await Promise.all(deletePromises);

			toast.success('User deleted successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				toast.error('Failed to delete user');
			}
		} finally {
			set({ isDeletingUser: false });
		}
	},

	async createAddress(data) {
		try {
			set({ isCreatingAddress: true });
			const res = await createAddress(data);
			console.log(res);
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isCreatingAddress: false });
		}
	},
}));

export default useManagementStore;
