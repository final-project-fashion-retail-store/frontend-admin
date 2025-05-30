import DialogCustom from '@/components/DialogCustom';
import SelectCustom from '@/components/SelectCustom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateUserForm from '@/pages/components/User/Form/CreateUserForm';
import { useGeneralStore } from '@/store';
import { Plus } from 'lucide-react';
import { useState } from 'react';

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
	const destroyImages = useGeneralStore((state) => state.destroyImages);
	const [imageId, setImageId] = useState<{ publicId: string[] }>({
		publicId: [''],
	});
	const getImageAvatarId = (public_id: string) => {
		setImageId({ publicId: [public_id] });
	};

	// handle when dialog closes
	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen && imageId.publicId[0]) {
			destroyImages(imageId);
		}
	};

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
					form={<CreateUserForm getImageAvatarId={getImageAvatarId} />}
					handleOpenChange={handleOpenChange}
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
