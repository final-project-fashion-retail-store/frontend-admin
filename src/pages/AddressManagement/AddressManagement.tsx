import useDebounce from '@/hooks/use-debounce';
import Header from '@/pages/components/Header';
import Filter from '@/pages/components/Filter';
import TableCustom from '@/pages/components/TableCustom';
import TableRowCustom from '@/pages/AddressManagement/Table/TableRowCustom';
import { useUserManagementStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Pagination from '@/pages/components/Pagination';
import type { UserAddressType } from '@/types';
import Overlay from '@/components/ui/overlay';
import DialogCustom from '@/components/DialogCustom';
import AddressForm from '@/pages/AddressManagement/Form/AddressForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SelectCustom from '@/components/SelectCustom';

type TableColumn<T> = {
	key: keyof T;
	label: string;
	sortable?: boolean;
};

const addressColumns: TableColumn<UserAddressType>[] = [
	{ key: '_id', label: 'ID' },
	{ key: 'user', label: 'Email' },
	{ key: 'fullName', label: 'Name' },
	{ key: 'phoneNumber', label: 'Phone Number', sortable: true },
	{ key: 'addressLine', label: 'Address Line', sortable: true },
	{ key: 'city', label: 'City', sortable: true },
	{ key: 'district', label: 'District', sortable: true },
	{ key: 'ward', label: 'Ward', sortable: true },
	{ key: 'isDefault', label: 'default', sortable: true },
	{ key: 'label', label: 'Label' },
	{ key: 'formattedAddress', label: 'Address' },
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

const AddressManagement = () => {
	const [
		addresses,
		isCreatingAddress,
		isUpdatingAddress,
		isDeletingAddress,
		isGettingAddress,
		getAllAddresses,
		setSelectedAddress,
		pagination,
	] = useUserManagementStore(
		useShallow((state) => [
			state.addresses,
			state.isCreatingAddress,
			state.isUpdatingAddress,
			state.isDeletingAddress,
			state.isGettingAddress,
			state.getAllAddresses,
			state.setSelectedAddress,
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
		getAllAddresses(debounceValue, active, sort);
	}, [
		activeStatus,
		debounceValue,
		getAllAddresses,
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
		if (isGettingAddress || isUpdatingAddress) return;

		// Check if field is sortable
		const column = addressColumns.find((col) => col.key === field);
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
		if (isGettingAddress || isUpdatingAddress) return;
		setPaginationLink(paginationLink);
		getAllAddresses('', '', '', paginationLink);
	};

	return (
		<div className='w-full p-4 space-y-10'>
			<Header
				title='Address Management'
				description='Manage your address and their information'
			/>
			<div className='w-full '>
				<div className='w-full space-y-4'>
					{(isUpdatingAddress || isCreatingAddress || isDeletingAddress) && (
						<Overlay />
					)}
					{/* filter */}
					<Filter
						placeHolderSearch='Search user id, name, phone, city, district, etc'
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
								description='Create a new address'
								form={<AddressForm />}
								// handleOpenChange={handleOpenChange}
							>
								<Button
									variant={'outline'}
									className='size-10 rounded-sm'
									onClick={() => setSelectedAddress(null)}
								>
									<Plus className='size-6' />
								</Button>
							</DialogCustom>
						}
					/>
					<TableCustom
						data={addresses || []}
						isGettingData={isGettingAddress}
						handleClickSortField={handleClickSortField}
						columns={addressColumns}
						emptyMessage='There is no address'
						renderRow={(address, index) => (
							<TableRowCustom
								key={address._id}
								index={index}
								data={address}
								searchValue={debounceValue}
								active={
									activeStatus === 'all' ? '' : activeStatus === 'active' ? true : false
								}
								sort={currentSort.current}
								paginationLink={paginationLink}
								dialogTitle='Edit'
								dialogDescription='Create an address'
								form={<AddressForm />}
								dialogClassName='sm:max-w-[700px]'
							/>
						)}
					/>
					{/* Pagination */}
					{!isGettingAddress && pagination && (
						<Pagination
							page='address(es)'
							pagination={pagination}
							handleClickPagination={handleClickPagination}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddressManagement;
