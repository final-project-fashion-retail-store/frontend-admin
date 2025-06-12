import SelectFormCustom from '@/components/SelectFormCustom';
import { CardContent } from '@/components/ui/card';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';
import { Fragment } from 'react';
import type { ProductFormValues } from './ProductFormContainer';
import type { UseFormReturn } from 'react-hook-form';
import CardHeaderCustom from '@/pages/ProductManagement/Form/CardHeaderCustom';

type Props = {
	form: UseFormReturn<ProductFormValues>;
	brandItems: { id: string; name: string }[];
	categoryItems: { id: string; name: string }[];
	handleChangeCategory: (_: unknown, __: unknown, title?: string) => void;
};

const BasicInformation = ({
	form,
	brandItems,
	categoryItems,
	handleChangeCategory,
}: Props) => {
	return (
		<Fragment>
			<CardHeaderCustom
				title='Basic Information'
				Icon={Package}
				iconClassName='size-5 text-blue-600'
			/>
			<CardContent className='space-y-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Product Name <span className='text-destructive'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder='Enter product name'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='w-full flex gap-4 max-md:flex-col'>
					<div className='flex-1'>
						<SelectFormCustom
							className='w-full'
							control={form.control}
							name='brand'
							label='Brand'
							placeholder='Select brand'
							items={brandItems}
							passToValue='id'
							// onValueChange={handleChangeSelect}
							required
						/>
					</div>
					<div className='flex-1'>
						<SelectFormCustom
							className='w-full'
							control={form.control}
							name='category'
							label='Category'
							placeholder='Select category'
							items={categoryItems}
							passToValue='id'
							onValueChange={handleChangeCategory}
							required
						/>
					</div>
				</div>
			</CardContent>
		</Fragment>
	);
};

export default BasicInformation;
