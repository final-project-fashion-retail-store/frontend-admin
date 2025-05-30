import type { UserAddressType } from '@/types/UserAddressType';

export type UserType = {
	_id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	role: 'user' | 'staff' | 'admin';
	phoneNumber: string;
	avatar: { url: string; public_id: string };
	addresses: UserAddressType[];
	passwordChangedAt: Date;
	active: boolean;
	createdAt: Date;
};
