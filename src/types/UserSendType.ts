export type UserSendType = {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	avatar?: { url: string; public_id: string };
	active?: boolean;
	role?: 'user' | 'staff';
};
