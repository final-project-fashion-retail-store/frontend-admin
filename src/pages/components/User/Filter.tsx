import SelectCustom from '@/components/SelectCustom';
import { Input } from '@/components/ui/input';

type Props = {
	placeHolderSearch?: string;
	searchValue: string;
	activeStatus: string;
	handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSelectStatus: (value: string) => void;
	formDialog: React.ReactNode;
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
	placeHolderSearch,
	searchValue,
	activeStatus,
	handleSearch,
	handleSelectStatus,
	formDialog,
}: Props) => {
	return (
		<div className='w-full flex flex-row items-center'>
			<div className='w-3/4'>
				<div className='w-full flex max-lg:flex-col gap-4 max-lg:gap-1'>
					<Input
						className='xl:w-1/2'
						type='text'
						value={searchValue}
						placeholder={placeHolderSearch || ''}
						autoComplete='off'
						onChange={handleSearch}
					/>
					<SelectCustom
						className='w-[140px]'
						triggerPlaceHolder='Status'
						items={selectStatusItems}
						defaultValue={activeStatus}
						onValueChange={handleSelectStatus}
					/>
					<div className='max-lg:block hidden'>{formDialog}</div>
				</div>
			</div>
			<div className='w-1/4 lg:flex hidden flex-row items-center justify-end min-[1281px]:pr-10'>
				{formDialog}
			</div>
		</div>
	);
};

export default Filter;
