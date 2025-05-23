import type { UserAddressType } from '@/types/UserAddressType';

export type UserType = {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	role: string;
	phoneNumber: string;
	avatar: { url: string; public_id: string };
	addresses: UserAddressType[];
	passwordChangedAt: Date;
};
