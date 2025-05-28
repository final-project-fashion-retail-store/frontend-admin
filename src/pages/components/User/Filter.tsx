import DialogCustom from '@/components/DialogCustom';
import SelectCustom from '@/components/SelectCustom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateUserForm from '@/pages/components/User/Form/CreateUserForm';
import { Plus } from 'lucide-react';

type Props = {
	searchValue: string;
	activeStatus: string;
	handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSelectStatus: (value: string) => void;
};

// Select status items
const selectStatusItems = [
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

const Filter = ({
	searchValue,
	activeStatus,
	handleSearch,
	handleSelectStatus,
}: Props) => {
	return (
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
				<SelectCustom
					className='w-[140px]'
					triggerPlaceHolder='Status'
					items={selectStatusItems}
					defaultValue={activeStatus}
					onValueChange={handleSelectStatus}
				/>
				<DialogCustom
					className='sm:max-w-[700px]'
					title='Create'
					description='Create a new customer'
					form={<CreateUserForm />}
				>
					<Button
						variant={'outline'}
						className='size-10 rounded-sm'
					>
						<Plus className='size-6' />
					</Button>
				</DialogCustom>
			</div>
		</div>
	);
};

export default Filter;
