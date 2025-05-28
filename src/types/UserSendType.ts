import type { UserAddressType } from '@/types/UserAddressType';

export type UserSendType = {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	avatar?: { url: string; public_id: string };
	active?: boolean;
	userAddresses?: UserAddressType[];
	role?: 'user' | 'staff';
};
