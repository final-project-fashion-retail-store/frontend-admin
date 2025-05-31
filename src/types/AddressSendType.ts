export type AddressSendType = {
	user?: string;
	fullName?: string;
	phoneNumber?: string;
	addressLine?: string;
	city?: string;
	district?: string;
	ward?: string;
	label?: 'Home' | 'Work' | 'Other';
	active?: boolean;
};
