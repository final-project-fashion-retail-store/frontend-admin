import type { VariantType } from '@/types/VariantType';

export type ProductType = {
	_id: string;
	name: string;
	description: string;
	shortDescription: string;
	importPrice: number;
	price: number;
	salePrice: number;
	category: {
		_id: string;
		name: string;
		slug: string;
	};
	brand: {
		_id: string;
		name: string;
		logo: {
			url: string;
			public_id: string;
		};
	};
	images: {
		url: string;
		public_id: string;
	}[];
	colorImages: {
		[color: string]: {
			url: string;
			public_id: string;
		}[];
	};
	tags: string[];
	gender: string;
	season: string;
	material: string[];
	careInstructions: string;
	variants: VariantType[];
	active: boolean;
	inStock: boolean;
	featuredProduct: boolean;
	averageRating: number;
	totalReviews: number;
	metaTitle: string;
	metaDescription: string;
	slug: string;
};
