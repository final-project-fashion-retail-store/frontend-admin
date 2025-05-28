import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';

import { useShallow } from 'zustand/react/shallow';
import { useManagementStore } from '@/store';
import TableRowCustom from '@/pages/components/User/Table/TableRowCustom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import { use } from 'react';
import UserContext from '@/pages/components/User/Context/UserContext';

const TableCustom = () => {
	const [users, isGettingUser] = useManagementStore(
		useShallow((state) => [state.users, state.isGettingUser])
	);

	const { handleClickSortField } = use(UserContext);

	return (
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
							key={user._id}
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
	);
};

export default TableCustom;
