import type {
	AddressSendType,
	BrandSendType,
	CategorySendType,
	ProductSendType,
	SubcategorySendType,
	UserSendType,
} from '@/types';
import instance from '@/utils/axios';
import { isAxiosError } from 'axios';

// User
export const getAllUsers = async (
	role?: 'user' | 'staff',
	searchValue?: string,
	active?: boolean | '',
	sort?: string | '',
	paginationLink?: string
) => {
	try {
		const res = await instance.get(
			paginationLink ||
				`/users?userManageSearch=${searchValue}&role=${role}&active=${active}&sort=${sort}&limit=5`
		);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const getUser = async (id: string) => {
	try {
		const res = await instance.get(`/users/${id}`);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createUser = async (data: UserSendType) => {
	try {
		const res = await instance.post('/users', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const updateUser = async (id: string, data: UserSendType) => {
	try {
		const res = await instance.patch(`/users/${id}`, data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const completelyDeleteUserAccount = async (id: string) => {
	try {
		await instance.delete(`/users/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

// Address (Cuz address in user management, so writing call API of it here)
export const getAllAddresses = async (
	searchValue: string,
	active: boolean | '',
	sort: string,
	paginationLink: string
) => {
	try {
		const res = await instance.get(
			paginationLink ||
				`/addresses?addressManageSearch=${searchValue}&active=${active}&sort=${sort}&paginationLink=${paginationLink}&limit=5`
		);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const getAddress = async (id: string) => {
	try {
		const res = await instance.get(`/addresses/${id}`);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createAddress = async (data: AddressSendType) => {
	try {
		const res = await instance.post('/addresses', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const editAddress = async (id: string, data: AddressSendType) => {
	try {
		const res = await instance.patch(`/addresses/${id}`, data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const completelyDeleteAddress = async (id: string) => {
	try {
		await instance.delete(`/addresses/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

// Purpose is to delete all addresses of a user when the user is deleted completely
export const completelyDeleteAddresses = async (userId: string) => {
	try {
		await instance.delete(`/addresses/delete-addresses/${userId}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

// Product (includes category, subcategory, brand and product)
// Product
export const getProduct = async (slug: string) => {
	try {
		const res = await instance.get(`/products/${slug}`);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const getAllProducts = async (
	searchValue?: string,
	active?: boolean | '',
	inStock?: boolean | '',
	featured?: boolean | '',
	category?: string | '',
	brand?: string | '',
	sort?: string | '',
	paginationLink?: string
) => {
	try {
		const res = await instance.get(
			paginationLink ||
				`/products?productManageSearch=${searchValue}&active=${active}&inStock=${inStock}&featuredProduct=${featured}&category=${category}&brand=${brand}&sort=${sort}&limit=5`
		);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createProduct = async (data: ProductSendType) => {
	try {
		const res = await instance.post('/products', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const updateProduct = async (id: string, data: ProductSendType) => {
	try {
		const res = await instance.patch(`/products/${id}`, data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const deleteProduct = async (id: string) => {
	try {
		await instance.delete(`/products/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

// category
export const getAllCategories = async (
	searchValue?: string,
	active?: boolean | '',
	sort?: string | '',
	paginationLink?: string,
	limit?: number
) => {
	try {
		const res = await instance.get(
			paginationLink ||
				`/categories?categoryManageSearch=${searchValue}&active=${active}&sort=${sort}&limit=${limit}`
		);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createCategory = async (data: CategorySendType) => {
	try {
		const res = await instance.post('/categories', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const updateCategory = async (id: string, data: CategorySendType) => {
	try {
		const res = await instance.patch(`/categories/${id}`, data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const deleteCategory = async (id: string) => {
	try {
		await instance.delete(`/categories/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

// Subcategory
export const getAllSubcategories = async (
	searchValue?: string,
	active?: boolean | '',
	sort?: string | '',
	paginationLink?: string,
	limit?: number
) => {
	try {
		const res = await instance.get(
			paginationLink ||
				`/subcategories?subcategoryManageSearch=${searchValue}&active=${active}&sort=${sort}&limit=${limit}`
		);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createSubcategory = async (data: SubcategorySendType) => {
	try {
		const res = await instance.post('/subcategories', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const updateSubcategory = async (
	id: string,
	data: SubcategorySendType
) => {
	try {
		const res = await instance.patch(`/subcategories/${id}`, data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const deleteSubcategory = async (id: string) => {
	try {
		await instance.delete(`/subcategories/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

// Brand
export const getAllBrands = async (
	searchValue?: string,
	active?: boolean | '',
	sort?: string | '',
	featured?: boolean | '',
	paginationLink?: string,
	limit?: number
) => {
	try {
		const res = await instance.get(
			paginationLink ||
				`/brands?brandManageSearch=${searchValue}&active=${active}&sort=${sort}&featuredBrand=${featured}&limit=${limit}`
		);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const createBrands = async (data: BrandSendType) => {
	try {
		const res = await instance.post('/brands', data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const updateBrand = async (id: string, data: BrandSendType) => {
	try {
		const res = await instance.patch(`/brands/${id}`, data);
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const deleteBrand = async (id: string) => {
	try {
		await instance.delete(`/brands/${id}`);
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const getBrandStats = async () => {
	try {
		const res = await instance.get('/brands/stats');
		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};
