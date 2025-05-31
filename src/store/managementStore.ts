import {
	completelyDeleteAddress,
	completelyDeleteAddresses,
	completelyDeleteUserAccount,
	createAddress,
	createUser,
	editAddress,
	getAddress,
	getAllAddresses,
	getAllUsers,
	updateUser,
} from '@/services';
import useGeneralStore from '@/store/generalStore';
import type {
	AddressSendType,
	PaginationType,
	UserAddressType,
	UserSendType,
	UserType,
} from '@/types';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';

type Store = {
	pagination: PaginationType | null;

	// user state
	users: UserType[] | null;
	selectedUser: UserType | null;
	isGettingUser: boolean;
	isCreatingUser: boolean;
	isUpdatingUser: boolean;
	isDeletingUser: boolean;

	// address state
	addresses: UserAddressType[] | null;
	selectedAddress: UserAddressType | null;
	isGettingAddress: boolean;
	isCreatingAddress: boolean;
	isUpdatingAddress: boolean;
	isDeletingAddress: boolean;

	// user function
	getAllUsers: (
		role?: 'user' | 'staff',
		searchValue?: string,
		active?: boolean | '',
		sort?: string | '',
		paginationLink?: string
	) => void;
	createUser: (data: UserSendType) => Promise<string | void>;
	updateUser: (id: string, data: UserSendType) => void;
	deleteUser: (user: UserType) => void;

	// address function
	getAllAddresses: (
		searchValue?: string,
		active?: boolean | '',
		sort?: string | '',
		paginationLink?: string
	) => void;
	getAddress: (id: string) => void;
	createAddress: (data: AddressSendType) => Promise<void | string>;
	updateAddress: (id: string, data: AddressSendType) => Promise<void | string>;
	deleteAddress: (id: string) => void;
};

const useManagementStore = create<Store>((set, get) => ({
	pagination: null,

	// user state
	users: null,
	selectedUser: null,
	isGettingUser: false,
	isCreatingUser: false,
	isUpdatingUser: false,
	isDeletingUser: false,

	// address state
	addresses: null,
	selectedAddress: null,
	isGettingAddress: false,
	isCreatingAddress: false,
	isUpdatingAddress: false,
	isDeletingAddress: false,

	// User function
	async createUser(data) {
		try {
			set({ isCreatingUser: true });
			await createUser(data);

			toast.success('User created successfully');
			const { getAllUsers } = get();
			await getAllUsers();
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				toast.error('Failed to create user');
				return err?.response?.data?.message;
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

	// Address function
	async getAllAddresses(
		searchValue = '',
		active = '',
		sort = '',
		paginationLink = ''
	) {
		set({ isGettingAddress: true });
		try {
			const res = await getAllAddresses(searchValue, active, sort, paginationLink);
			set({ addresses: res.data.data, pagination: res.data.pagination });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingAddress: false });
		}
	},

	async getAddress(id) {
		set({ isGettingAddress: true });
		try {
			const res = await getAddress(id);
			set({ selectedAddress: res.data.data });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingAddress: false });
		}
	},

	async createAddress(data) {
		try {
			set({ isCreatingAddress: true });
			await createAddress(data);
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isCreatingAddress: false });
		}
	},

	async updateAddress(id, data) {
		set({ isUpdatingAddress: true });
		try {
			const res = await editAddress(id, data);
			set({ selectedAddress: res.data.data });
			toast.success('Address updated successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				toast.error('Failed to update address');
				return err?.response?.data?.message;
			}
		} finally {
			set({ isUpdatingAddress: false });
		}
	},

	async deleteAddress(id) {
		try {
			set({ isDeletingAddress: true });
			await completelyDeleteAddress(id);
			toast.success('Address deleted successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				toast.error('Failed to delete address');
			}
		} finally {
			set({ isDeletingAddress: false });
		}
	},
}));

export default useManagementStore;
