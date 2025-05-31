import type { UserAddressType } from '@/types';
import { Fragment } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useShallow } from 'zustand/react/shallow';
import { useManagementStore } from '@/store';
import AlertDialogCustom from '@/components/AlertDialogCustom';

type Props = {
	index: number;
	data: UserAddressType;
	searchValue: string;
	active: boolean | '';
	sort: string;
	paginationLink: string;
};

const TableRowCustom = ({
	index,
	data,
	searchValue,
	active,
	sort,
	paginationLink,
}: Props) => {
	const [updateAddress, deleteAddress, getAllAddresses] = useManagementStore(
		useShallow((state) => [
			state.updateAddress,
			state.deleteAddress,
			state.getAllAddresses,
		])
	);

	const handleClickAction = (action: string) => {
		if (action === 'activate' || action === 'deactivate') {
			updateAddress(data?._id, { active: action === 'activate' ? true : false });
			getAllAddresses(searchValue, active, sort, paginationLink);
		} else if (action === 'delete') {
			deleteAddress(data?._id);
			getAllAddresses(searchValue, active, sort, paginationLink);
		}
	};

	return (
		<Fragment>
			<TableRow>
				<TableCell className='font-medium'>{index + 1}</TableCell>
				<TableCell>
					{(typeof data.user === 'object' && data.user.email) || 'None'}
				</TableCell>
				<TableCell>{data.fullName || 'None'}</TableCell>
				<TableCell className='text-center'>{data.phoneNumber || 'None'}</TableCell>
				<TableCell className='text-center'>{data.addressLine || 'None'}</TableCell>
				<TableCell className='text-center'>{data.city || 'None'}</TableCell>
				<TableCell className='text-center'>{data.district || 'None'}</TableCell>
				<TableCell className='text-center'>{data.ward || 'None'}</TableCell>
				<TableCell className='text-center'>
					{data.isDefault ? <Badge variant={'outline'}>Default</Badge> : 'None'}
				</TableCell>
				<TableCell className='text-center'>{data.label || 'None'}</TableCell>
				<TableCell>{data.formattedAddress || 'None'}</TableCell>
				<TableCell className='text-center'>
					<Badge className={`${data.active ? 'bg-primary' : 'bg-destructive'}`}>
						{data.active ? 'Active' : 'Inactive'}
					</Badge>
				</TableCell>
				<TableCell>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className='w-full flex items-center justify-start'>
								<span className='size-10 flex items-center justify-center hover:bg-accent rounded-sm cursor-pointer'>
									<MoreHorizontal />
								</span>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Action</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Edit</DropdownMenuItem>
							<AlertDialogCustom
								title={`Are you sure you want to ${
									data?.active ? 'deactivate' : 'activate'
								} this user?`}
								description=''
								handler={[
									() => handleClickAction(data?.active ? 'deactivate' : 'activate'),
								]}
								asChild
							>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									{data?.active ? 'Deactivate' : 'Activate  '}
								</DropdownMenuItem>
							</AlertDialogCustom>
							<AlertDialogCustom
								title='Are you sure you want to delete this user?'
								description='This action cannot be undone. This will permanently delete the account and remove the data from the servers.'
								handler={[() => handleClickAction('delete')]}
								asChild
							>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									Delete
								</DropdownMenuItem>
							</AlertDialogCustom>
						</DropdownMenuContent>
					</DropdownMenu>
				</TableCell>
			</TableRow>
		</Fragment>
	);
};

export default TableRowCustom;
