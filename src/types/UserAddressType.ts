export type UserAddressType = {
	_id: string;
	user: { email: string };
	fullName: string;
	phoneNumber: string;
	addressLine: string;
	formattedAddress: string;
	city: string;
	district: string;
	ward: string;
	isDefault: boolean;
	label: 'Home' | 'Work' | 'Other';
	active: boolean;
};
