import {
	createBrands,
	createCategory,
	createProduct,
	createSubcategory,
	deleteBrand,
	deleteCategory,
	deleteProduct,
	deleteSubcategory,
	getAllBrands,
	getAllCategories,
	getAllProducts,
	getAllSubcategories,
	getBrandStats,
	getProduct,
	updateBrand,
	updateCategory,
	updateProduct,
	updateSubcategory,
} from '@/services';
import useGeneralStore from '@/store/generalStore';
import type {
	BrandSendType,
	BrandType,
	BrandStatType,
	CategorySendType,
	CategoryType,
	PaginationType,
	SubcategorySendType,
	SubcategoryType,
	ProductSendType,
	ProductType,
} from '@/types';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';

type Store = {
	pagination: PaginationType | null;

	// Product states
	products: ProductType[] | null;
	selectedProduct: ProductType | null;
	isGettingProduct: boolean;
	isCreatingProduct: boolean;
	isUpdatingProduct: boolean;
	isDeletingProduct: boolean;

	// Category states
	categories: CategoryType[] | null;
	selectedCategory: CategoryType | null;
	isGettingCategory: boolean;
	isCreatingCategory: boolean;
	isUpdatingCategory: boolean;
	isDeletingCategory: boolean;

	// Subcategory states
	subcategories: SubcategoryType[] | null;
	selectedSubcategory: SubcategoryType | null;
	isGettingSubcategory: boolean;
	isCreatingSubcategory: boolean;
	isUpdatingSubcategory: boolean;
	isDeletingSubcategory: boolean;

	// brand states
	brands: BrandType[] | null;
	selectedBrand: BrandType | null;
	brandStats: BrandStatType | null;
	isGettingBrand: boolean;
	isCreatingBrand: boolean;
	isUpdatingBrand: boolean;
	isDeletingBrand: boolean;

	// functions
	resetProductStates: () => void;

	// Product functions
	getProduct: (slug: string) => void;
	getProducts: (
		searchValue?: string,
		active?: boolean | '',
		inStock?: boolean | '',
		featured?: boolean | '',
		category?: string | '',
		brand?: string | '',
		sort?: string | '',
		paginationLink?: string
	) => void;
	createProduct: (data: ProductSendType) => Promise<string | null>;
	updateProduct: (id: string, data: ProductSendType) => Promise<string | null>;
	deleteProduct: (data: ProductType) => void;
	setSelectedProduct: (product: ProductType | null) => void;

	// Category functions
	getCategories: (
		searchValue?: string,
		active?: boolean | '',
		sort?: string | '',
		paginationLink?: string,
		limit?: number
	) => void;
	createCategory: (data: CategorySendType) => Promise<string | null>;
	updateCategory: (id: string, data: CategorySendType) => Promise<string | null>;
	deleteCategory: (id: string) => void;
	setSelectedCategory: (category: CategoryType | null) => void;

	// Subcategory functions
	getSubcategories: (
		searchValue?: string,
		active?: boolean | '',
		sort?: string | '',
		paginationLink?: string,
		limit?: number,
		setPagination?: boolean
	) => void;
	createSubcategory: (data: SubcategorySendType) => Promise<string | void>;
	updateSubcategory: (
		id: string,
		data: SubcategorySendType
	) => Promise<string | void>;
	deleteSubcategory: (id: string) => void;
	setSelectedSubcategory: (subcategory: SubcategoryType | null) => void;

	// Brand functions
	getBrands: (
		searchValue?: string,
		active?: boolean | '',
		sort?: string | '',
		featured?: boolean | '',
		paginationLink?: string,
		limit?: number,
		setPagination?: boolean
	) => void;
	createBrand: (data: BrandSendType) => Promise<string | void>;
	updateBrand: (id: string, data: BrandSendType) => Promise<string | void>;
	deleteBrand: (brand: BrandType) => void;
	setSelectedBrand: (brand: BrandType | null) => void;
	getBrandStats: () => void;
};

const useProductManagementStore = create<Store>((set) => ({
	pagination: null,

	// Product states
	products: null,
	selectedProduct: null,
	isGettingProduct: false,
	isCreatingProduct: false,
	isUpdatingProduct: false,
	isDeletingProduct: false,

	// Category states
	categories: null,
	selectedCategory: null,
	isGettingCategory: false,
	isCreatingCategory: false,
	isUpdatingCategory: false,
	isDeletingCategory: false,

	// Subcategory states
	subcategories: null,
	selectedSubcategory: null,
	isGettingSubcategory: false,
	isCreatingSubcategory: false,
	isUpdatingSubcategory: false,
	isDeletingSubcategory: false,

	// Brand states
	brands: null,
	selectedBrand: null,
	brandStats: null,
	isGettingBrand: false,
	isCreatingBrand: false,
	isUpdatingBrand: false,
	isDeletingBrand: false,

	// Product functions
	setSelectedProduct: (product) => {
		set({ selectedProduct: product });
	},

	async getProduct(slug) {
		try {
			set({ isGettingProduct: true });
			const res = await getProduct(slug);
			set({ selectedProduct: res.data.data });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingProduct: false });
		}
	},

	getProducts: async (
		searchValue = '',
		active = '',
		inStock = '',
		featured = '',
		category = '',
		brand = '',
		sort = '',
		paginationLink = ''
	) => {
		try {
			set({ isGettingProduct: true });
			const res = await getAllProducts(
				searchValue,
				active,
				inStock,
				featured,
				category,
				brand,
				sort,
				paginationLink
			);
			set({ products: res.data.data, pagination: res.data.pagination });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingProduct: false });
		}
	},

	async createProduct(data) {
		try {
			set({ isCreatingProduct: true });
			await createProduct(data);
			toast.success('Product created successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to create product');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isCreatingProduct: false });
		}
	},

	async updateProduct(id, data) {
		try {
			set({ isUpdatingProduct: true });
			await updateProduct(id, data);
			toast.success('Product updated successfully');
			set({ selectedProduct: null });
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to update product');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isUpdatingProduct: false });
		}
	},

	async deleteProduct(data) {
		try {
			set({ isDeletingProduct: true });
			const { destroyImages } = useGeneralStore.getState();
			const deletePromises = [deleteProduct(data._id)];

			// get public IDs of images to delete
			const publicId: string[] = [];
			if (data.images.length > 0) {
				data.images.forEach((image) => {
					if (image.public_id) {
						publicId.push(image.public_id);
					}
				});
			}

			if (Object.keys(data.colorImages).length > 0) {
				for (const color in data.colorImages) {
					data.colorImages[color].forEach((image) => {
						if (image.public_id) {
							publicId.push(image.public_id);
						}
					});
				}
			}

			if (publicId.length > 0) {
				deletePromises.push(destroyImages({ publicId }).then(() => void 0));
			}
			await Promise.all(deletePromises);
			toast.success('Product deleted successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to delete product');
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isDeletingProduct: false });
		}
	},

	// Category functions
	setSelectedCategory(category) {
		set({ selectedCategory: category });
	},

	async getCategories(
		searchValue = '',
		active = '',
		sort = '',
		paginationLink = '',
		limit = 5
	) {
		try {
			set({ isGettingCategory: true });
			const res = await getAllCategories(
				searchValue,
				active,
				sort,
				paginationLink,
				limit
			);

			set({ categories: res.data.data, pagination: res.data.pagination });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingCategory: false });
		}
	},

	async createCategory(data) {
		try {
			set({ isCreatingCategory: true });
			await createCategory(data);
			toast.success('Category created successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to create category');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isCreatingCategory: false });
		}
	},

	async updateCategory(id, data) {
		try {
			set({ isUpdatingCategory: true });
			await updateCategory(id, data);
			toast.success('Category updated successfully');
			set({ selectedCategory: null });
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to update category');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isUpdatingCategory: false });
		}
	},

	async deleteCategory(id) {
		try {
			set({ isDeletingCategory: true });
			await deleteCategory(id);
			toast.success('Category deleted successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to delete category');
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isDeletingCategory: false });
		}
	},

	// Subcategory functions
	setSelectedSubcategory(subcategory) {
		set({ selectedSubcategory: subcategory });
	},

	async getSubcategories(
		searchValue = '',
		active = '',
		sort = '',
		paginationLink = '',
		limit = 5,
		setPagination = true
	) {
		try {
			set({ isGettingSubcategory: true });
			const res = await getAllSubcategories(
				searchValue,
				active,
				sort,
				paginationLink,
				limit
			);

			set({ subcategories: res.data.data });
			if (setPagination) {
				console.log('????');
				set({ pagination: res.data.pagination });
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingSubcategory: false });
		}
	},

	async createSubcategory(data) {
		try {
			set({ isCreatingSubcategory: true });
			await createSubcategory(data);
			toast.success('Subcategory created successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to create subcategory');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isCreatingSubcategory: false });
		}
	},

	async updateSubcategory(id, data) {
		try {
			set({ isUpdatingSubcategory: true });
			await updateSubcategory(id, data);
			toast.success('Subcategory updated successfully');
			set({ selectedSubcategory: null });
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to update subcategory');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isUpdatingSubcategory: false });
		}
	},

	async deleteSubcategory(id) {
		try {
			set({ isDeletingSubcategory: true });
			await deleteSubcategory(id);
			toast.success('Subcategory deleted successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to delete subcategory');
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isDeletingSubcategory: false });
		}
	},

	// Brand functions
	setSelectedBrand(brand) {
		set({ selectedBrand: brand });
	},

	async getBrands(
		searchValue = '',
		active = '',
		sort = '',
		featured = '',
		paginationLink = '',
		limit = 5,
		setPagination = true
	) {
		try {
			set({ isGettingBrand: true });
			const res = await getAllBrands(
				searchValue,
				active,
				sort,
				featured,
				paginationLink,
				limit
			);

			set({ brands: res.data.data });
			if (setPagination) {
				set({ pagination: res.data.pagination });
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isGettingBrand: false });
		}
	},

	async createBrand(data) {
		try {
			set({ isCreatingBrand: true });
			console.log(data);
			await createBrands(data);
			toast.success('Brand created successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to create brand');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isCreatingBrand: false });
		}
	},

	async updateBrand(id, data) {
		try {
			set({ isUpdatingBrand: true });
			await updateBrand(id, data);
			toast.success('Brand updated successfully');
			set({ selectedBrand: null });
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to update brand');
				console.log(err);
				console.log(err?.response?.data?.message);
				return err?.response?.data?.message;
			}
		} finally {
			set({ isUpdatingBrand: false });
		}
	},

	async deleteBrand(brand) {
		try {
			set({ isDeletingBrand: true });
			const publicId = brand.logo?.public_id;
			const { destroyImages } = useGeneralStore.getState();
			const deletePromises = [deleteBrand(brand._id)];
			// Add image deletion if avatar exists
			if (publicId) {
				deletePromises.push(
					destroyImages({ publicId: [publicId] }).then(() => void 0)
				);
			}

			// Execute all promises concurrently
			await Promise.all(deletePromises);

			toast.success('Brand deleted successfully');
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to delete brand');
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isDeletingBrand: false });
		}
	},

	async getBrandStats() {
		try {
			const res = await getBrandStats();
			set({ brandStats: res.data });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		}
	},

	resetProductStates() {
		set({ selectedProduct: null });
	},
}));

export default useProductManagementStore;
