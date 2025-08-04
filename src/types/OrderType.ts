import type { ProductType } from '@/types/ProductType';

export type OrderType = {
	_id: string;
	user: {
		avatar: {
			url: string;
		};
		email: string;
		fullName: string;
		phoneNumber: string;
	};
	items: {
		product: ProductType;
		variantId: string;
		quantity: number;
		price: number;
		name: string;
		image: string;
	}[];
	paymentDetails: {
		status: string;
	};
	shippingAddress: {
		fullName: string;
		phoneNumber: string;
		addressLine: string;
		city: string;
		district: string;
		ward: string;
		formattedAddress: string;
		label: string;
	};
	subtotal: number;
	shippingCost: number;
	taxAmount: number;
	totalAmount: number;
	status: string;
	orderNumber: string;
	createdAt: string;
};
