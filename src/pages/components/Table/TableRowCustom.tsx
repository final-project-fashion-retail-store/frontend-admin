import type { UserType } from '@/types';
import { Fragment } from 'react';

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

type Props = {
	index: number;
	data: UserType;
};

const TableRowCustom = ({ index, data }: Props) => {
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
						{data?.userAddresses?.length > 0 ? (
							<>
								<>
									{
										data?.userAddresses.find((address) => address?.isDefault === true)
											?.formattedAddress
									}
								</>
								{data?.userAddresses?.length > 1 && (
									<span className='relative inline-block pb-0.5 overflow-hidden group cursor-pointer text-sm text-muted-foreground hover:text-foreground'>
										{`+ ${data?.userAddresses?.length - 1} more address(es)`}
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
							<DropdownMenuItem>
								{data?.active ? 'Deactivate' : 'Activate  '}
							</DropdownMenuItem>
							<DropdownMenuItem>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</TableCell>
			</TableRow>
			{data?.userAddresses?.length > 1 && (
				<TableRow>
					<TableCell
						colSpan={7}
						className='bg-accent'
					>
						<div className='size-full p-4 pl-18'>
							<div className='flex flex-col justify-center items-start gap-2'>
								<span>All Addresses:</span>
								<ul className='space-y-2'>
									{data?.userAddresses?.map((address) => (
										<li
											key={address?.id}
											className='flex items-center gap-2 text-muted-foreground'
										>
											<MapPin className='size-4' />
											{address?.formattedAddress}
											<Badge variant={'outline'}>Default</Badge>
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
