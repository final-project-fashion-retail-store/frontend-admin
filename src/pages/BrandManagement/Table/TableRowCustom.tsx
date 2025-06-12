import type { BrandType } from '@/types';
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
import { useGeneralStore, useProductManagementStore } from '@/store';
import AlertDialogCustom from '@/components/AlertDialogCustom';
import DialogCustom from '@/components/DialogCustom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
	index: number;
	data: BrandType;
	searchValue: string;
	active: boolean | '';
	sort: string;
	featured: boolean | '';
	paginationLink: string;
	dialogClassName: string;
	dialogTitle: string;
	dialogDescription: string;
	form: React.ReactNode;
};

const TableRowCustom = ({
	index,
	data,
	searchValue,
	active,
	sort,
	featured,
	paginationLink,
	dialogClassName,
	dialogTitle,
	dialogDescription,
	form,
}: Props) => {
	const [updateBrand, deleteBrand, getBrands, setSelectedBrand] =
		useProductManagementStore(
			useShallow((state) => [
				state.updateBrand,
				state.deleteBrand,
				state.getBrands,
				state.setSelectedBrand,
			])
		);
	const setUploadedImages = useGeneralStore((state) => state.setUploadedImages);

	const handleClickAction = async (action: string) => {
		if (action === 'activate' || action === 'deactivate') {
			await updateBrand(data?._id, {
				active: action === 'activate' ? true : false,
			});
			await getBrands(searchValue, active, sort, featured, paginationLink);
		} else if (action === 'delete') {
			await deleteBrand(data);
			await getBrands(searchValue, active, sort, featured, paginationLink);
		}
	};

	return (
		<Fragment>
			<TableRow>
				<TableCell className='font-medium'>{index + 1}</TableCell>
				<TableCell>
					<div className='flex flex-row items-center gap-2'>
						<Avatar className='rounded-lg size-12'>
							<AvatarImage src={data.logo.url} />
							<AvatarFallback>LG</AvatarFallback>
						</Avatar>
						<div className='flex flex-col justify-center items-start gap-1'>
							<p className='font-semibold'>{data.name}</p>
							{data.featuredBrand && (
								<Badge
									className='font-semibold'
									variant={'outline'}
								>
									<Star />
									Featured
								</Badge>
							)}
						</div>
					</div>
				</TableCell>
				<TableCell className='text-start'>{data.productNum}</TableCell>
				<TableCell className='text-start'>
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
							<DialogCustom
								className={dialogClassName}
								title={dialogTitle}
								description={dialogDescription}
								form={form}
							>
								<DropdownMenuItem
									onSelect={(e) => e.preventDefault()}
									onClick={() => {
										setSelectedBrand(data);
										setUploadedImages([
											{ secure_url: data.logo.url, public_id: data.logo.public_id },
										]);
									}}
								>
									Edit
								</DropdownMenuItem>
							</DialogCustom>
							<AlertDialogCustom
								title={`Are you sure you want to ${
									data?.active ? 'deactivate' : 'activate'
								} this brand?`}
								description=''
								handler={[
									() => handleClickAction(data?.active ? 'deactivate' : 'activate'),
								]}
								asChild
							>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									{data?.active ? 'Deactivate' : 'Activate'}
								</DropdownMenuItem>
							</AlertDialogCustom>
							<AlertDialogCustom
								title='Are you sure you want to delete this brand?'
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
