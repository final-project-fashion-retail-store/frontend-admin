import type { CategoryType } from '@/types';
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
import { useProductManagementStore } from '@/store';
import AlertDialogCustom from '@/components/AlertDialogCustom';
import DialogCustom from '@/components/DialogCustom';

type Props = {
	index: number;
	data: CategoryType;
	searchValue: string;
	active: boolean | '';
	sort: string;
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
	paginationLink,
	dialogClassName,
	dialogTitle,
	dialogDescription,
	form,
}: Props) => {
	const [updateCategory, deleteCategory, getCategories, setSelectedCategory] =
		useProductManagementStore(
			useShallow((state) => [
				state.updateCategory,
				state.deleteCategory,
				state.getCategories,
				state.setSelectedCategory,
			])
		);

	const handleClickAction = async (action: string) => {
		if (action === 'activate' || action === 'deactivate') {
			await updateCategory(data?._id, {
				active: action === 'activate' ? true : false,
			});
			await getCategories(searchValue, active, sort, paginationLink);
		} else if (action === 'delete') {
			await deleteCategory(data?._id);
			await getCategories(searchValue, active, sort, paginationLink);
		}
	};

	return (
		<Fragment>
			<TableRow>
				<TableCell className='font-medium'>{index + 1}</TableCell>
				<TableCell>{data.name || 'None'}</TableCell>
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
									onClick={() => setSelectedCategory(data)}
								>
									Edit
								</DropdownMenuItem>
							</DialogCustom>
							<AlertDialogCustom
								title={`Are you sure you want to ${
									data?.active ? 'deactivate' : 'activate'
								} this category?`}
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
								title='Are you sure you want to delete this category?'
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
