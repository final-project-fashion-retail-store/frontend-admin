import { getAllUsers } from '@/services';
import type { UserType } from '@/types';
import { AxiosError } from 'axios';
import { create } from 'zustand';

type Store = {
	users: UserType[] | null;
	isGettingUser: boolean;

	getAllUsers: (
		role?: 'user' | 'staff',
		searchValue?: string,
		active?: boolean | '',
		sort?: string | ''
	) => void;
};

const useManagementStore = create<Store>((set) => ({
	users: null,
	isGettingUser: false,

	async getAllUsers(role, searchValue = '', active = '', sort = '') {
		set({ isGettingUser: true });
		try {
			const res = await getAllUsers(role, searchValue, active, sort);
			set({ users: res.data.data });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingUser: false });
		}
	},
}));

export default useManagementStore;
