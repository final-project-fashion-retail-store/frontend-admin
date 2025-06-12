import { Fragment } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { DollarSign } from 'lucide-react';

import { CardContent } from '@/components/ui/card';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ProductFormValues } from '@/pages/ProductManagement/Form/ProductFormContainer';
import CardHeaderCustom from '@/pages/ProductManagement/Form/CardHeaderCustom';

type Props = {
	form: UseFormReturn<ProductFormValues>;
};

const Pricing = ({ form }: Props) => {
	return (
		<Fragment>
			<CardHeaderCustom
				title='Pricing'
				Icon={DollarSign}
				iconClassName='size-5 text-green-600'
			/>
			<CardContent className='space-y-4'>
				<div className='w-full flex gap-4 max-md:flex-col'>
					<div className='flex-1'>
						<FormField
							control={form.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Base Price <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<div className='relative'>
											<DollarSign className='absolute size-4 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
											<Input
												className='pl-10'
												type='number'
												step='0.01'
												placeholder='0.00'
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='flex-1'>
						<FormField
							control={form.control}
							name='salePrice'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sale Price</FormLabel>
									<FormControl>
										<div className='relative'>
											<DollarSign className='absolute size-4 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
											<Input
												className='pl-10'
												type='number'
												step='0.01'
												placeholder='0.00'
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</CardContent>
		</Fragment>
	);
};

export default Pricing;
