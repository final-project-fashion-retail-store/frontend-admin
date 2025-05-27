import { useEffect, useState } from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShallow } from 'zustand/react/shallow';
import { useManagementStore } from '@/store';
import TableRowCustom from '@/pages/components/Table/TableRowCustom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import useDebounce from '@/hooks/use-debounce';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const TableCustom = () => {
	const [users, isGettingUser, getAllUsers] = useManagementStore(
		useShallow((state) => [state.users, state.isGettingUser, state.getAllUsers])
	);
	const [activeStatus, setActiveStatus] = useState<
		'all' | 'active' | 'inactive'
	>('all');
	const [sortName, setSortName] = useState<'asc' | 'desc' | ''>('');
	const [sortEmail, setSortEmail] = useState<'asc' | 'desc' | ''>('');
	const [searchValue, setSearchValue] = useState('');
	const debounceValue = useDebounce(searchValue, 1000);

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
		console.log(`Name sort: ${sortName}, Email sort: ${sortEmail}`);
		getAllUsers('user', debounceValue, active, sort);
	}, [activeStatus, debounceValue, getAllUsers, sortEmail, sortName]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isGettingUser) return;
		setSearchValue(e.target.value);
	};

	const handleSelectStatus = (value: 'all' | 'active' | 'inactive') => {
		if (isGettingUser) return;

		setActiveStatus(value);
	};

	const handleClickSortField = (field: 'name' | 'email') => {
		if (isGettingUser) return;

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

	return (
		<div className='w-full space-y-4'>
			{/* filter */}
			<div className='w-full flex flex-row items-center gap-4'>
				<div className='w-1/4'>
					<Input
						type='text'
						value={searchValue}
						placeholder='Search name, email, phone number'
						autoComplete='off'
						onChange={handleSearch}
					/>
				</div>
				<div className='w-3/4 flex flex-row items-center justify-start gap-4'>
					<Select
						defaultValue={activeStatus}
						onValueChange={handleSelectStatus}
					>
						<SelectTrigger className='w-[140px]'>
							<SelectValue placeholder='Status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Status</SelectItem>
							<SelectItem value='active'>Active</SelectItem>
							<SelectItem value='inactive'>Inactive</SelectItem>
						</SelectContent>
					</Select>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={'outline'}
									className='size-10 rounded-sm'
								>
									<Plus className='size-6' />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Insert a new customer</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						{/* <TableHead className='w-[100px]'>ID</TableHead> */}
						<TableHead>ID</TableHead>
						<TableHead>
							<div
								className='size-full flex items-center justify-start'
								onClick={() => handleClickSortField('name')}
							>
								<span className='p-2 flex items-center justify-center gap-2 hover:bg-accent rounded-sm cursor-pointer'>
									Name
									<ArrowUpDown className='size-4 max-size-4' />
								</span>
							</div>
						</TableHead>
						<TableHead>
							<div
								className='size-full flex items-center justify-start'
								onClick={() => handleClickSortField('email')}
							>
								<span className='p-2 flex items-center justify-center gap-2 hover:bg-accent rounded-sm cursor-pointer'>
									Email
									<ArrowUpDown className='size-4 max-size-4' />
								</span>
							</div>
						</TableHead>
						<TableHead>Phone Number</TableHead>
						<TableHead>Addresses</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Action</TableHead>
						{/* <TableHead className='text-right'>Amount</TableHead> */}
					</TableRow>
				</TableHeader>
				<TableBody>
					{users && users.length > 0 && !isGettingUser ? (
						users.map((user, index) => (
							<TableRowCustom
								key={index}
								index={index}
								data={user}
							/>
						))
					) : isGettingUser ? (
						<TableRow>
							<TableCell
								colSpan={7}
								className='bg-accent min-h-[200px] h-[200px]'
							>
								<div className='size-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							</TableCell>
						</TableRow>
					) : (
						<TableRow>
							<TableCell
								colSpan={7}
								className='text-center bg-accent min-h-[200px] h-[200px]'
							>
								There is no customer
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{/* Pagination */}
			{!isGettingUser && (
				<div className='w-full flex flex-row items-center justify-between'>
					<span className='text-muted-foreground text-sm'>
						Showing 5 of 5 customers
					</span>
					<div className='h-full flex items-center space-x-4 p-2'>
						<Button variant={'ghost'}>
							<ChevronLeft /> Previous
						</Button>
						<Button variant={'ghost'}>
							Next <ChevronRight />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TableCustom;
