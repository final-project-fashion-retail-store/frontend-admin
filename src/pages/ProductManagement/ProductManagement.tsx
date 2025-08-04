import useDebounce from '@/hooks/use-debounce';
import Header from '@/pages/components/Header';
import Filter from '@/pages/components/Filter';
import TableCustom from '@/pages/components/TableCustom';
import TableRowCustom from '@/pages/ProductManagement/Table/TableRowCustom';
import { useProductManagementStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/pages/components/Pagination';
import type { ProductType } from '@/types';
import Overlay from '@/components/ui/overlay';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SelectCustom from '@/components/SelectCustom';
import { Link, Outlet, useLocation } from 'react-router-dom';

type TableColumn<T> = {
	key: keyof T;
	label: string;
	sortable?: boolean;
};

const productColumns: TableColumn<ProductType>[] = [
	{ key: '_id', label: 'ID' },
	{ key: 'name', label: 'Product', sortable: true },
	{ key: 'category', label: 'Category' },
	{ key: 'price', label: 'Price', sortable: true },
	{ key: 'variants', label: 'Variant' },
	{ key: 'inStock', label: 'Inventory' },
	{ key: 'averageRating', label: 'Rating', sortable: true },
	{ key: 'active', label: 'Status' },
];

const filterSelectItems = [
	{
		title: 'All Status',
		value: 'all',
	},
	{
		title: 'Active',
		value: 'active',
	},
	{
		title: 'Inactive',
		value: 'inactive',
	},
	{
		title: 'In Stock',
		value: 'inStock',
	},
	{
		title: 'Out of Stock',
		value: 'outOfStock',
	},
	{
		title: 'Featured',
		value: 'featured',
	},
];

const ProductManagement = () => {
	const [
		products,
		subcategories,
		brands,
		isCreatingProduct,
		isUpdatingProduct,
		isDeletingProduct,
		isGettingProduct,
		getProducts,
		getSubcategories,
		getBrands,
		setSelectedProduct,
		pagination,
	] = useProductManagementStore(
		useShallow((state) => [
			state.products,
			state.subcategories,
			state.brands,
			state.isCreatingProduct,
			state.isUpdatingProduct,
			state.isDeletingProduct,
			state.isGettingProduct,
			state.getProducts,
			state.getSubcategories,
			state.getBrands,
			state.setSelectedProduct,
			state.pagination,
		])
	);
	console.log(pagination);
	const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
	const [filterValue, setFilterValue] = useState<string>('all');
	const [filterCategoryValue, setFilterCategoryValue] = useState<string>('all');
	const [filterBrandValue, setFilterBrandValue] = useState<string>('all');
	const [searchValue, setSearchValue] = useState('');
	const [paginationLink, setPaginationLink] = useState<string>('');
	const debounceValue = useDebounce(searchValue, 1000);

	const location = useLocation();
	const page = location.pathname.includes('create')
		? 'create'
		: location.pathname.includes('edit')
		? 'edit'
		: 'list';

	const currentSort = useRef<string>('');
	const categoryItemsRef = useRef<{ title: string; value: string }[]>([]);
	const brandItemsRef = useRef<{ title: string; value: string }[]>([]);

	useEffect(() => {
		getProducts();
	}, [getProducts]);

	useEffect(() => {
		getSubcategories('', '', '', '', 1000, false);
	}, [getSubcategories]);

	useEffect(() => {
		getBrands('', '', '', '', '', 1000, false);
	}, [getBrands]);

	useEffect(() => {
		if (subcategories && subcategories.length > 0) {
			categoryItemsRef.current = subcategories.map((subcategory) => ({
				title: subcategory.name,
				value: subcategory._id,
			}));
			categoryItemsRef.current.unshift({ title: 'All Categories', value: 'all' });
		}
	}, [subcategories]);

	useEffect(() => {
		if (brands && brands.length > 0) {
			brandItemsRef.current = brands.map((brand) => ({
				title: brand.name,
				value: brand._id,
			}));
			brandItemsRef.current.unshift({ title: 'All Brands', value: 'all' });
		}
	}, [brands]);

	useEffect(() => {
		const active =
			filterValue === 'active' ? true : filterValue === 'inactive' ? false : '';
		const inStock =
			filterValue === 'inStock' ? true : filterValue === 'outOfStock' ? false : '';
		const featuredProduct = filterValue === 'featured' ? true : '';
		const category = filterCategoryValue === 'all' ? '' : filterCategoryValue;
		const brand = filterBrandValue === 'all' ? '' : filterBrandValue;
		const sort = sortConfig.field
			? (sortConfig.direction === 'desc' ? '-' : '') + sortConfig.field
			: '';

		currentSort.current = sort;
		getProducts(
			debounceValue,
			active,
			inStock,
			featuredProduct,
			category,
			brand,
			sort
		);
	}, [
		filterValue,
		debounceValue,
		getProducts,
		sortConfig.direction,
		sortConfig.field,
		filterCategoryValue,
		filterBrandValue,
	]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleSelectStatus = (value: string) => {
		setFilterValue(value);
	};

	const handleSelectCategory = (value: string) => {
		setFilterCategoryValue(value);
	};

	const handleSelectBrand = (value: string) => {
		setFilterBrandValue(value);
	};

	const handleClickSortField = (field: string) => {
		if (isGettingProduct || isUpdatingProduct) return;

		// Check if field is sortable
		const column = productColumns.find((col) => col.key === field);
		if (!column?.sortable) return;

		setSortConfig((prev) => {
			if (prev.field !== field) {
				// New field selected
				return { field, direction: 'asc' };
			}

			// Same field - toggle direction
			const direction =
				prev.direction === 'asc'
					? 'desc'
					: prev.direction === 'desc'
					? 'asc'
					: 'asc';
			return { field, direction };
		});
	};
	const handleClickPagination = (paginationLink: string) => {
		if (isGettingProduct || isUpdatingProduct) return;
		setPaginationLink(paginationLink);
		getProducts('', '', '', '', '', '', '', paginationLink);
	};

	return (
		<>
			{(page === 'create' || page === 'edit') && <Outlet />}
			{page === 'list' && (
				<div className='w-full p-4 space-y-10'>
					<Header
						title='Product Management'
						description='Manage your product and their information'
					/>
					<div className='w-full '>
						<div className='w-full space-y-4'>
							{(isUpdatingProduct || isCreatingProduct || isDeletingProduct) && (
								<Overlay />
							)}
							{/* filter */}
							<Filter
								placeHolderSearch='Search name'
								searchValue={searchValue}
								handleSearch={handleSearch}
								SelectStatus={
									<SelectCustom
										className='min-w-[140px]'
										triggerPlaceHolder='Status'
										items={filterSelectItems}
										defaultValue={filterValue}
										onValueChange={handleSelectStatus}
									/>
								}
								SelectBrand={
									<SelectCustom
										className='min-w-[140px]'
										triggerPlaceHolder='Brand'
										items={brandItemsRef.current}
										defaultValue={filterBrandValue}
										onValueChange={handleSelectBrand}
									/>
								}
								SelectCategory={
									<SelectCustom
										className='min-w-[140px]'
										triggerPlaceHolder='Category'
										items={categoryItemsRef.current}
										defaultValue={filterCategoryValue}
										onValueChange={handleSelectCategory}
									/>
								}
								formDialog={
									<Button
										variant={'outline'}
										className='size-10 rounded-sm'
										onClick={() => setSelectedProduct(null)}
									>
										<Link to={'create'}>
											<Plus className='size-6' />
										</Link>
									</Button>
								}
							/>
							<TableCustom
								data={products || []}
								isGettingData={isGettingProduct}
								handleClickSortField={handleClickSortField}
								columns={productColumns}
								emptyMessage='There is no product'
								renderRow={(product, index) => (
									<TableRowCustom
										key={product._id}
										index={index}
										data={product}
										searchValue={debounceValue}
										active={
											filterValue === 'active'
												? true
												: filterValue === 'inactive'
												? false
												: ''
										}
										sort={currentSort.current}
										paginationLink={paginationLink}
									/>
								)}
							/>
							{/* Pagination */}
							{!isGettingProduct && pagination && (
								<Pagination
									page='product(es)'
									pagination={pagination}
									handleClickPagination={handleClickPagination}
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProductManagement;
