import type { ProductType } from '@/types';
import { Fragment } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Star } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useShallow } from 'zustand/react/shallow';
import { useProductManagementStore } from '@/store';
import AlertDialogCustom from '@/components/AlertDialogCustom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

type Props = {
	index: number;
	data: ProductType;
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
	const [updateProduct, deleteProduct, getProducts] = useProductManagementStore(
		useShallow((state) => [
			state.updateProduct,
			state.deleteProduct,
			state.getProducts,
		])
	);

	// calculate inventory
	const totalInventory = data.variants.reduce(
		(acc, variant) => acc + variant.inventory,
		0
	);
	const totalReservedInventory = data.variants.reduce(
		(acc, variant) => acc + variant.reservedInventory,
		0
	);

	const handleClickAction = async (action: string) => {
		if (action === 'activate' || action === 'deactivate') {
			await updateProduct(data?._id, {
				active: action === 'activate' ? true : false,
			});
			await getProducts(searchValue, active, '', '', '', '', sort, paginationLink);
		} else if (action === 'delete') {
			await deleteProduct(data);
			await getProducts(searchValue, active, '', '', '', '', sort, paginationLink);
		}
	};

	return (
		<Fragment>
			<TableRow>
				<TableCell className='font-medium'>{index + 1}</TableCell>
				<TableCell>
					<div className='flex flex-row items-center gap-2'>
						<Avatar className='rounded-lg size-14'>
							<AvatarImage src={data.images[0].url} />
							<AvatarFallback>PD</AvatarFallback>
						</Avatar>
						<div className='flex flex-col justify-center items-start gap-1'>
							<p className='font-medium'>{data.name}</p>
							<p className='text-sm text-muted-foreground'>
								{data.brand?.name || 'None'}
							</p>
							<div className='flex flex-row items-center gap-2'>
								{data.featuredProduct && (
									<Badge
										className='font-semibold'
										variant={'outline'}
									>
										<Star />
										Featured
									</Badge>
								)}
								<Badge variant={'outline'}>{data.gender}</Badge>
							</div>
						</div>
					</div>
				</TableCell>
				<TableCell>
					<Badge
						className='font-medium'
						variant={'outline'}
					>
						{data.category.name}
					</Badge>
				</TableCell>
				<TableCell>
					{data.price > data.salePrice ? (
						<div className='font-medium'>
							<p className='text-destructive'>${data.salePrice}</p>
							<p className='line-through text-muted-foreground'>${data.price}</p>
						</div>
					) : (
						<p className='font-semibold'>${data.price}</p>
					)}
				</TableCell>
				<TableCell>
					<div>
						<p className='font-medium'>{`${data.variants.length} variants`}</p>
						<p className='text-muted-foreground'>Color, Size</p>
					</div>
				</TableCell>
				<TableCell>
					<div>
						<p className='font-medium'>
							{totalInventory - totalReservedInventory}/{totalInventory}
						</p>
						{data.inStock ? (
							<Badge className='bg-emerald-500 font-semibold'>In Stock</Badge>
						) : (
							<Badge className='bg-destructive font-semibold'>Out of Stock</Badge>
						)}
						<p className='text-xs text-destructive'>
							{totalReservedInventory} reserved
						</p>
					</div>
				</TableCell>
				<TableCell>
					<div className='flex items-center gap-1'>
						<Star className='text-yellow-400 fill-yellow-400' />
						<span>{data.averageRating}</span>
						<span>({data.totalReviews})</span>
					</div>
				</TableCell>
				<TableCell>
					<Badge className={`${data.active ? 'bg-emerald-500' : 'bg-destructive'}`}>
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
							<DropdownMenuItem
								asChild
								onSelect={(e) => e.preventDefault()}
							>
								<Link to={`${data.slug}/edit`}>Edit</Link>
							</DropdownMenuItem>
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
