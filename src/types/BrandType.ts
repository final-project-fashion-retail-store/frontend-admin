export type BrandType = {
	_id: string;
	name: string;
	logo: {
		url: string;
		public_id: string;
	};
	productNum: number;
	featuredBrand: boolean;
	active: boolean;
};
