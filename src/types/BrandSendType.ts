export type BrandSendType = {
	name?: string;
	logo?: {
		url: string;
		public_id: string;
	};
	featuredBrand?: boolean;
	active?: boolean;
};
