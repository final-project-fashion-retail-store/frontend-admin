import useDebounce from '@/hooks/use-debounce';
import Header from '@/pages/components/Header';
import Filter from '@/pages/components/Filter';
import TableCustom from '@/pages/components/TableCustom';
import TableRowCustom from '@/pages/BrandManagement/Table/TableRowCustom';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/pages/components/Pagination';
import type { BrandType } from '@/types';
import Overlay from '@/components/ui/overlay';
import DialogCustom from '@/components/DialogCustom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGeneralStore, useProductManagementStore } from '@/store';
import BrandForm from '@/pages/BrandManagement/Form/BrandForm';
import Stats from '@/pages/BrandManagement/Stats/Stats';
import SelectCustom from '@/components/SelectCustom';

type TableColumn<T> = {
	key: keyof T;
	label: string;
	sortable?: boolean;
};

const categoryColumns: TableColumn<BrandType>[] = [
	{ key: '_id', label: 'ID' },
	{ key: 'name', label: 'Brand', sortable: true },
	{ key: 'productNum', label: 'Products', sortable: true },
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
		title: 'Featured',
		value: 'featured',
	},
];

const BrandManagement = () => {
	const [
		brands,
		isGettingBrand,
		isCreatingBrand,
		isUpdatingBrand,
		isDeletingBrand,
		getBrands,
		setSelectedBrand,
		getBrandStats,
		pagination,
	] = useProductManagementStore(
		useShallow((state) => [
			state.brands,
			state.isGettingBrand,
			state.isCreatingBrand,
			state.isUpdatingBrand,
			state.isDeletingBrand,
			state.getBrands,
			state.setSelectedBrand,
			state.getBrandStats,
			state.pagination,
		])
	);
	const [uploadedImages, resetStates, destroyImages] = useGeneralStore(
		useShallow((state) => [
			state.uploadedImages,
			state.resetStates,
			state.destroyImages,
		])
	);

	const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
	const [filterValue, setFilterValue] = useState<string>('all');
	const [searchValue, setSearchValue] = useState('');
	const [paginationLink, setPaginationLink] = useState<string>('');
	const debounceValue = useDebounce(searchValue, 1000);
	const [isCreatedBrand, setIsCreatedBrand] = useState(false);

	const currentSort = useRef<string>('');

	useEffect(() => {
		getBrandStats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let active: boolean | '' = '';
		let featuredBrand: boolean | '' = '';

		if (filterValue === 'featured') {
			featuredBrand = true;
		} else {
			active =
				filterValue === 'all' ? '' : filterValue === 'active' ? true : false;
		}

		const sort = sortConfig.field
			? (sortConfig.direction === 'desc' ? '-' : '') + sortConfig.field
			: '';

		currentSort.current = sort;
		getBrands(debounceValue, active, sort, featuredBrand);
	}, [
		filterValue,
		debounceValue,
		getBrands,
		sortConfig.direction,
		sortConfig.field,
	]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleSelectStatus = (value: string) => {
		setFilterValue(value);
	};

	const handleClickSortField = (field: string) => {
		if (isGettingBrand) return;

		// Check if field is sortable
		const column = categoryColumns.find((col) => col.key === field);
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
		if (isGettingBrand) return;
		setPaginationLink(paginationLink);
		getBrands('', '', '', '', paginationLink);
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen && uploadedImages?.[0] && !isCreatedBrand) {
			destroyImages({ publicId: [uploadedImages[0].public_id] });
		}
		resetStates();
	};

	return (
		<div className='w-full p-4 space-y-10'>
			<Header
				title='Brand Management'
				description='Manage brands and their information'
			/>
			<div className='w-full '>
				<div className='w-full space-y-4'>
					{(isUpdatingBrand || isCreatingBrand || isDeletingBrand) && <Overlay />}
					{/* Stats */}
					<Stats />
					{/* filter */}
					<Filter
						placeHolderSearch='Search name'
						searchValue={searchValue}
						handleSearch={handleSearch}
						SelectStatus={
							<SelectCustom
								className='w-[140px]'
								triggerPlaceHolder='Status'
								items={filterSelectItems}
								defaultValue={filterValue}
								onValueChange={handleSelectStatus}
							/>
						}
						formDialog={
							<DialogCustom
								className='sm:max-w-[700px]'
								title='Create'
								description='Create a new brand'
								form={<BrandForm setIsCreatedBrand={setIsCreatedBrand} />}
								handleOpenChange={handleOpenChange}
							>
								<Button
									variant={'outline'}
									className='size-10 rounded-sm'
									onClick={() => setSelectedBrand(null)}
								>
									<Plus className='size-6' />
								</Button>
							</DialogCustom>
						}
					/>
					<TableCustom
						data={brands || []}
						isGettingData={isGettingBrand}
						handleClickSortField={handleClickSortField}
						columns={categoryColumns}
						emptyMessage='There is no brand'
						renderRow={(category, index) => (
							<TableRowCustom
								key={category._id}
								index={index}
								data={category}
								searchValue={debounceValue}
								active={
									filterValue === 'all'
										? ''
										: filterValue === 'active'
										? true
										: filterValue === 'inactive'
										? false
										: ''
								}
								sort={currentSort.current}
								featured={filterValue === 'featured' ? true : ''}
								paginationLink={paginationLink}
								dialogTitle='Edit'
								dialogDescription='Edit a brand'
								form={<BrandForm setIsCreatedBrand={setIsCreatedBrand} />}
								dialogClassName='sm:max-w-[700px]'
							/>
						)}
					/>
					{/* Pagination */}
					{!isGettingBrand && pagination && (
						<Pagination
							page='brand(es)'
							pagination={pagination}
							handleClickPagination={handleClickPagination}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default BrandManagement;
