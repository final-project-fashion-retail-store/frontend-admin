import { Input } from '@/components/ui/input';

type Props = {
	placeHolderSearch?: string;
	searchValue: string;
	handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
	SelectStatus?: React.ReactNode;
	SelectBrand?: React.ReactNode;
	SelectCategory?: React.ReactNode;
	SelectPaymentStatus?: React.ReactNode;
	SelectOrderStatus?: React.ReactNode;
	formDialog?: React.ReactNode;
};

const Filter = ({
	placeHolderSearch,
	searchValue,
	handleSearch,
	SelectStatus,
	SelectBrand,
	SelectCategory,
	SelectPaymentStatus,
	SelectOrderStatus,
	formDialog,
}: Props) => {
	return (
		<div className='w-full flex flex-row items-center'>
			<div className='w-3/4'>
				<div className='w-full flex max-[1025px]:flex-col gap-4 max-[1025px]:gap-1'>
					<Input
						className='xl:w-1/2'
						type='text'
						value={searchValue}
						placeholder={placeHolderSearch || ''}
						autoComplete='off'
						onChange={handleSearch}
					/>
					{SelectStatus && SelectStatus}
					{SelectBrand && SelectBrand}
					{SelectCategory && SelectCategory}
					{SelectPaymentStatus && SelectPaymentStatus}
					{SelectOrderStatus && SelectOrderStatus}
					<div className='max-[1025px]:block hidden'>{formDialog}</div>
				</div>
			</div>
			<div className='w-1/4 min-[1025px]:flex hidden flex-row items-center justify-end min-[1281px]:pr-10'>
				{formDialog}
			</div>
		</div>
	);
};

export default Filter;
