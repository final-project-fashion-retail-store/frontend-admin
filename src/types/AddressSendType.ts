export type AddressSendType = {
	email?: string;
	fullName?: string;
	phoneNumber?: string;
	addressLine?: string;
	city?: string;
	district?: string;
	ward?: string;
	label?: 'Home' | 'Work' | 'Other';
	active?: boolean;
	isDefault?: boolean;
};
