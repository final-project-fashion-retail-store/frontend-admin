import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Plus } from 'lucide-react';

import TableCustom from '@/pages/components/TableCustom';
import Overlay from '@/components/ui/overlay';
import useDebounce from '@/hooks/use-debounce';
import Header from '@/pages/components/Header';
import Pagination from '@/pages/components/Pagination';
import Filter from '@/pages/components/Filter';
import type { UserType } from '@/types';
import TableRowCustom from '@/pages/components/User/Table/TableRowCustom';
import DialogCustom from '@/components/DialogCustom';
import UserForm from '@/pages/components/User/Form/UserForm';
import { Button } from '@/components/ui/button';
import { useGeneralStore, useUserManagementStore } from '@/store';
import SelectCustom from '@/components/SelectCustom';

type TableColumn<T> = {
	key: keyof T;
	label: string;
	sortable?: boolean;
};

const userColumns: TableColumn<UserType>[] = [
	{ key: '_id', label: 'ID' },
	{ key: 'firstName', label: 'Name', sortable: true },
	{ key: 'email', label: 'Email', sortable: true },
	{ key: 'phoneNumber', label: 'Phone Number' },
	{ key: 'addresses', label: 'Addresses' },
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
];

const CustomerManagement = () => {
	const [
		users,
		isGettingUser,
		isUpdatingUser,
		getAllUsers,
		setSelectedUser,
		pagination,
	] = useUserManagementStore(
		useShallow((state) => [
			state.users,
			state.isGettingUser,
			state.isUpdatingUser,
			state.getAllUsers,
			state.setSelectedUser,
			state.pagination,
		])
	);
	const [uploadedImages, resetStates] = useGeneralStore(
		useShallow((state) => [state.uploadedImages, state.resetStates])
	);

	const [sortName, setSortName] = useState<'asc' | 'desc' | ''>('');
	const [sortEmail, setSortEmail] = useState<'asc' | 'desc' | ''>('');
	const [activeStatus, setActiveStatus] = useState<string>('all');
	const [searchValue, setSearchValue] = useState('');
	const [paginationLink, setPaginationLink] = useState<string>('');
	const [isCreatedCustomer, setIsCreatedCustomer] = useState(false);
	const destroyImages = useGeneralStore((state) => state.destroyImages);
	const debounceValue = useDebounce(searchValue, 1000);

	const currentSort = useRef<string>('');

	useEffect(() => {
		const active =
			activeStatus === 'all' ? '' : activeStatus === 'active' ? true : false;

		const getSortString = () => {
			if (sortName) return sortName === 'desc' ? '-firstName' : 'firstName';
			if (sortEmail) return sortEmail === 'desc' ? '-email' : 'email';
			return '';
		};
		const sort = getSortString();
		currentSort.current = sort;
		getAllUsers('user', debounceValue, active, sort);
	}, [activeStatus, debounceValue, getAllUsers, sortEmail, sortName]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isGettingUser || isUpdatingUser) return;
		setSearchValue(e.target.value);
	};

	const handleSelectStatus = (value: string) => {
		if (isGettingUser || isUpdatingUser) return;

		setActiveStatus(value);
	};

	const handleClickSortField = (field: string) => {
		if (isGettingUser || isUpdatingUser) return;

		const toggleSort = (current: string) => {
			if (current === 'asc') return 'desc';
			if (current === 'desc') return 'asc';
			return 'asc';
		};

		if (field === 'firstName') {
			setSortEmail('');
			setSortName(toggleSort(sortName));
		} else if (field === 'email') {
			setSortName('');
			setSortEmail(toggleSort(sortEmail));
		}
	};

	const handleClickPagination = (paginationLink: string) => {
		if (isGettingUser || isUpdatingUser) return;
		setPaginationLink(paginationLink);
		getAllUsers('user', '', '', '', paginationLink);
	};

	// handle when dialog closes
	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen && uploadedImages?.[0] && !isCreatedCustomer) {
			destroyImages({ publicId: [uploadedImages[0].public_id] });
		}
		resetStates();
	};

	return (
		<div className='w-full p-4 space-y-10'>
			{/* heading */}
			<Header
				title='Customer Management'
				description='Manage customers and their information'
			/>
			<div className='w-full'>
				<div className='w-full space-y-4'>
					{isUpdatingUser && <Overlay />}
					{/* filter */}
					<Filter
						placeHolderSearch='Search name, email, phone'
						searchValue={searchValue}
						SelectStatus={
							<SelectCustom
								className='w-[140px]'
								triggerPlaceHolder='Status'
								items={filterSelectItems}
								defaultValue={activeStatus}
								onValueChange={handleSelectStatus}
							/>
						}
						handleSearch={handleSearch}
						formDialog={
							<DialogCustom
								className='sm:max-w-[700px]'
								title='Create'
								description='Create a new customer'
								form={
									<UserForm
										role='user'
										setIsCreatedUser={setIsCreatedCustomer}
									/>
								}
								handleOpenChange={handleOpenChange}
							>
								<Button
									variant={'outline'}
									className='size-10 rounded-sm'
									onClick={() => setSelectedUser(null)}
								>
									<Plus className='size-6' />
								</Button>
							</DialogCustom>
						}
					/>
					<TableCustom
						data={users || []}
						isGettingData={isGettingUser}
						handleClickSortField={handleClickSortField}
						columns={userColumns}
						emptyMessage='There is no customer'
						renderRow={(user, index) => (
							<TableRowCustom
								key={user._id}
								index={index}
								data={user}
								role='user'
								searchValue={debounceValue}
								active={
									activeStatus === 'all' ? '' : activeStatus === 'active' ? true : false
								}
								sort={currentSort.current}
								paginationLink={paginationLink}
								dialogTitle='Edit'
								dialogDescription='Edit customer'
								form={
									<UserForm
										role='user'
										setIsCreatedUser={setIsCreatedCustomer}
									/>
								}
								dialogClassName='sm:max-w-[700px]'
							/>
						)}
					/>
					{/* Pagination */}
					{!isGettingUser && pagination && (
						<Pagination
							page='customer(s)'
							pagination={pagination}
							handleClickPagination={handleClickPagination}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default CustomerManagement;
