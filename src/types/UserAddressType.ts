export type UserAddressType = {
	_id: string;
	user: string | { email: string };
	fullName: string;
	phoneNumber: string;
	addressLine: string;
	formattedAddress: string;
	city: string;
	district: string;
	ward: string;
	isDefault: boolean;
	label: string;
	active: boolean;
};
