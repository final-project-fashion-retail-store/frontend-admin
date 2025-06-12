export type ProductSendType = {
	name?: string;
	description?: string;
	shortDescription?: string;
	price?: number;
	salePrice?: number;
	category?: string;
	brand?: string;
	images?: {
		url: string;
		public_id: string;
	}[];
	colorImages?: {
		[color: string]: {
			url: string;
			public_id: string;
		}[];
	};
	tag?: string;
	gender?: string;
	season?: string;
	material?: string[];
	careInstructions?: string;
	variants?: {
		_id?: string;
		sku?: string;
		color?: string;
		size?: string;
		price?: number;
		salePrice?: number;
		inventory?: number;
		reservedInventory?: number;
	}[];
	active?: boolean;
	featuredProduct?: boolean;
	metaTitle?: string;
	metaDescription?: string;
};
