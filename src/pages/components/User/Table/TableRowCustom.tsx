import type { UserType } from '@/types';
import { Fragment, use, useState } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MapPin, MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useShallow } from 'zustand/react/shallow';
import { useManagementStore } from '@/store';
import AlertDialogCustom from '@/components/AlertDialogCustom';
import UserContext from '@/pages/components/User/Context/UserContext';

type Props = {
	index: number;
	data: UserType;
};

const TableRowCustom = ({ index, data }: Props) => {
	const [updateUser, deleteUser, getAllUser] = useManagementStore(
		useShallow((state) => [state.updateUser, state.deleteUser, state.getAllUsers])
	);
	const [expandedRows, setExpandedRows] = useState<string[]>([]);

	const { role, searchValue, active, sort, paginationLink } = use(UserContext);

	const handleClickAction = (action: string) => {
		if (action === 'activate' || action === 'deactivate') {
			updateUser(data?._id, { active: action === 'activate' ? true : false });
			getAllUser(role, searchValue, active, sort, paginationLink);
		} else if (action === 'delete') {
			deleteUser(data);
			getAllUser(role, searchValue, active, sort, paginationLink);
		}
	};

	const toggleRowExpansion = (customerId: string) => {
		setExpandedRows((prev) =>
			prev.includes(customerId)
				? prev.filter((id) => id !== customerId)
				: [...prev, customerId]
		);
	};

	return (
		<Fragment>
			<TableRow>
				<TableCell className='font-medium'>{index + 1}</TableCell>
				<TableCell>
					<div className='flex flex-row items-center justify-start space-x-2'>
						<Avatar>
							<AvatarImage
								src={data?.avatar?.url}
								alt='Avatar'
							/>
							<AvatarFallback>FB</AvatarFallback>
						</Avatar>
						<span>{data?.fullName || 'None'}</span>
					</div>
				</TableCell>
				<TableCell>{data.email || 'None'}</TableCell>
				<TableCell>{data?.phoneNumber || 'None'}</TableCell>
				<TableCell>
					<div className='flex flex-col items-start justify-center gap-1'>
						{data?.addresses?.length > 0 ? (
							<>
								<>
									{
										data?.addresses.find((address) => address?.isDefault === true)
											?.formattedAddress
									}
								</>
								{data?.addresses?.length > 1 && (
									<span
										className='relative inline-block pb-0.5 overflow-hidden group cursor-pointer text-sm text-muted-foreground hover:text-foreground'
										onClick={() => toggleRowExpansion(data?._id)}
									>
										{`+ ${data?.addresses?.length - 1} more address(es)`}
										<span className='absolute bottom-0 left-0 w-full h-[1px] bg-foreground scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100' />
									</span>
								)}
							</>
						) : (
							'None'
						)}
					</div>
				</TableCell>
				<TableCell>
					<Badge className={`${data?.active ? 'bg-primary' : 'bg-destructive'}`}>
						{data?.active ? 'Active' : 'Inactive'}
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
			{expandedRows.includes(data?._id) && (
				<TableRow>
					<TableCell
						colSpan={7}
						className='bg-accent'
					>
						<div className='size-full p-4 pl-18'>
							<div className='flex flex-col justify-center items-start gap-2'>
								<span>All Addresses:</span>
								<ul className='space-y-2'>
									{data?.addresses?.map((address) => (
										<li
											key={address?.id}
											className='flex items-center gap-2 text-muted-foreground'
										>
											<MapPin className='size-4' />
											{address?.formattedAddress}
											{address?.isDefault && <Badge variant={'outline'}>Default</Badge>}
										</li>
									))}
								</ul>
							</div>
						</div>
					</TableCell>
				</TableRow>
			)}
		</Fragment>
	);
};

export default TableRowCustom;
