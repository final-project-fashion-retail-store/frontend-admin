import { useShallow } from 'zustand/react/shallow';

import TableCustom from '@/pages/components/User/Table/TableCustom';
import { useManagementStore } from '@/store';
import { useEffect, useRef, useState } from 'react';

import Overlay from '@/components/ui/overlay';
import useDebounce from '@/hooks/use-debounce';
import UserContext, {
	type Context,
} from '@/pages/components/User/Context/UserContext';
import Header from '@/pages/components/User/Header';
import Pagination from '@/pages/components/Pagination';
import Filter from '@/pages/components/User/Filter';

const CustomerManagement = () => {
	const [isGettingUser, isUpdatingUser, getAllUsers] = useManagementStore(
		useShallow((state) => [
			state.isGettingUser,
			state.isUpdatingUser,
			state.getAllUsers,
		])
	);
	const [sortName, setSortName] = useState<'asc' | 'desc' | ''>('');
	const [sortEmail, setSortEmail] = useState<'asc' | 'desc' | ''>('');
	const [activeStatus, setActiveStatus] = useState<string>('all');
	const [searchValue, setSearchValue] = useState('');
	const [paginationLink, setPaginationLink] = useState<string>('');
	const debounceValue = useDebounce(searchValue, 1000);

	const currentSort = useRef<string>('');

	useEffect(() => {
		const active =
			activeStatus === 'all' ? '' : activeStatus === 'active' ? true : false;

		let sort = '';
		if (sortName === 'asc') {
			sort = 'firstName';
		} else if (sortName === 'desc') {
			sort = '-firstName';
		} else if (sortEmail === 'asc') {
			sort = 'email';
		} else if (sortEmail === 'desc') {
			sort = '-email';
		}
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

	const handleClickSortField = (field: 'name' | 'email') => {
		if (isGettingUser || isUpdatingUser) return;

		if (field === 'name') {
			setSortEmail('');
			if (sortName === 'asc') {
				setSortName('desc');
			} else if (sortName === 'desc') {
				setSortName('asc');
			} else if (sortName === '') {
				setSortName('asc');
			}
		} else if (field === 'email') {
			setSortName('');
			if (sortEmail === 'asc') {
				setSortEmail('desc');
			} else if (sortEmail === 'desc') {
				setSortEmail('asc');
			} else if (sortEmail === '') {
				setSortEmail('asc');
			}
		}
	};

	const handleClickPagination = (paginationLink: string) => {
		if (isGettingUser || isUpdatingUser) return;
		setPaginationLink(paginationLink);
		getAllUsers('user', '', '', '', paginationLink);
	};

	const contextValues: Context = {
		role: 'user',
		searchValue: debounceValue,
		active:
			activeStatus === 'all' ? '' : activeStatus === 'active' ? true : false,
		sort: currentSort.current,
		paginationLink,
		handleClickSortField,
	};

	return (
		<UserContext.Provider value={contextValues}>
			<div className='w-full p-4 space-y-10'>
				{/* heading */}
				<Header
					title='Customer Management'
					description='Manage your customers and their information'
				/>
				<div className='w-full'>
					<div className='w-full space-y-4'>
						{isUpdatingUser && <Overlay />}
						{/* filter */}
						<Filter
							searchValue={searchValue}
							activeStatus={activeStatus}
							handleSearch={handleSearch}
							handleSelectStatus={handleSelectStatus}
						/>
						<TableCustom />
						{/* Pagination */}
						{!isGettingUser && (
							<Pagination handleClickPagination={handleClickPagination} />
						)}
					</div>
				</div>
			</div>
		</UserContext.Provider>
	);
};

export default CustomerManagement;
