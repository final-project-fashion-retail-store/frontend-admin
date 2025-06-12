import useDebounce from '@/hooks/use-debounce';
import Header from '@/pages/components/Header';
import Filter from '@/pages/components/Filter';
import TableCustom from '@/pages/components/TableCustom';
import TableRowCustom from '@/pages/SubcategoryManagement/Table/TableRowCustom';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/pages/components/Pagination';
import type { SubcategoryType } from '@/types';
import Overlay from '@/components/ui/overlay';
import DialogCustom from '@/components/DialogCustom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProductManagementStore } from '@/store';
import SubcategoryForm from '@/pages/SubcategoryManagement/Form/SubcategoryForm';
import SelectCustom from '@/components/SelectCustom';

type TableColumn<T> = {
	key: keyof T;
	label: string;
	sortable?: boolean;
};

const categoryColumns: TableColumn<SubcategoryType>[] = [
	{ key: '_id', label: 'ID' },
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'parentCategory', label: 'Parent category' },
	{ key: 'active', label: 'Active' },
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
];

const SubcategoryManagement = () => {
	const [
		subcategories,
		isCreatingSubcategory,
		isUpdatingSubcategory,
		isDeletingSubcategory,
		isGettingSubcategory,
		getSubcategories,
		setSelectedSubcategory,
		pagination,
	] = useProductManagementStore(
		useShallow((state) => [
			state.subcategories,
			state.isCreatingSubcategory,
			state.isUpdatingSubcategory,
			state.isDeletingSubcategory,
			state.isGettingSubcategory,
			state.getSubcategories,
			state.setSelectedSubcategory,
			state.pagination,
		])
	);

	const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
	const [activeStatus, setActiveStatus] = useState<string>('all');
	const [searchValue, setSearchValue] = useState('');
	const [paginationLink, setPaginationLink] = useState<string>('');
	const debounceValue = useDebounce(searchValue, 1000);

	const currentSort = useRef<string>('');

	useEffect(() => {
		const active =
			activeStatus === 'all' ? '' : activeStatus === 'active' ? true : false;

		const sort = sortConfig.field
			? (sortConfig.direction === 'desc' ? '-' : '') + sortConfig.field
			: '';

		currentSort.current = sort;
		getSubcategories(debounceValue, active, sort);
	}, [
		activeStatus,
		debounceValue,
		getSubcategories,
		sortConfig.direction,
		sortConfig.field,
	]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleSelectStatus = (value: string) => {
		setActiveStatus(value);
	};

	const handleClickSortField = (field: string) => {
		if (isGettingSubcategory || isUpdatingSubcategory) return;

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
		if (isGettingSubcategory || isUpdatingSubcategory) return;
		setPaginationLink(paginationLink);
		getSubcategories('', '', '', paginationLink);
	};

	return (
		<div className='w-full p-4 space-y-10'>
			<Header
				title='Category Management'
				description='Manage categories and their information'
			/>
			<div className='w-full '>
				<div className='w-full space-y-4'>
					{(isUpdatingSubcategory ||
						isCreatingSubcategory ||
						isDeletingSubcategory) && <Overlay />}
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
								defaultValue={activeStatus}
								onValueChange={handleSelectStatus}
							/>
						}
						formDialog={
							<DialogCustom
								className='sm:max-w-[700px]'
								title='Create'
								description='Create a new subcategory'
								form={<SubcategoryForm />}
								// handleOpenChange={handleOpenChange}
							>
								<Button
									variant={'outline'}
									className='size-10 rounded-sm'
									onClick={() => setSelectedSubcategory(null)}
								>
									<Plus className='size-6' />
								</Button>
							</DialogCustom>
						}
					/>
					<TableCustom
						data={subcategories || []}
						isGettingData={isGettingSubcategory}
						handleClickSortField={handleClickSortField}
						columns={categoryColumns}
						emptyMessage='There is no subcategory'
						renderRow={(subcategory, index) => (
							<TableRowCustom
								key={subcategory._id}
								index={index}
								data={subcategory}
								searchValue={debounceValue}
								active={
									activeStatus === 'all' ? '' : activeStatus === 'active' ? true : false
								}
								sort={currentSort.current}
								paginationLink={paginationLink}
								dialogTitle='Edit'
								dialogDescription='Edit a subcategory'
								form={<SubcategoryForm />}
								dialogClassName='sm:max-w-[700px]'
							/>
						)}
					/>
					{/* Pagination */}
					{!isGettingSubcategory && pagination && (
						<Pagination
							page='subcategory(es)'
							pagination={pagination}
							handleClickPagination={handleClickPagination}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default SubcategoryManagement;
