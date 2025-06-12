import { Fragment } from 'react';
import { BarChart3 } from 'lucide-react';
import type { ProductFormValues } from '@/pages/ProductManagement/Form/ProductFormContainer';
import type { UseFormReturn } from 'react-hook-form';

import { CardContent } from '@/components/ui/card';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import CardHeaderCustom from '@/pages/ProductManagement/Form/CardHeaderCustom';

type Props = {
	form: UseFormReturn<ProductFormValues>;
};

const ProductSetting = ({ form }: Props) => {
	return (
		<Fragment>
			<CardHeaderCustom
				Icon={BarChart3}
				title='Product Settings'
				iconClassName='size-5 text-pink-600'
			/>
			<CardContent className='space-y-4'>
				<FormField
					control={form.control}
					name='inStock'
					render={({ field }) => (
						<FormItem className='flex flex-row items-center justify-between'>
							<div className='space-y-0.5'>
								<FormLabel>In Stock</FormLabel>
								<FormDescription>Product is available for purchase</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Separator />
				<FormField
					control={form.control}
					name='featuredProduct'
					render={({ field }) => (
						<FormItem className='flex flex-row items-center justify-between'>
							<div className='space-y-0.5'>
								<FormLabel>Featured Product</FormLabel>
								<FormDescription>Show in featured products section</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</CardContent>
		</Fragment>
	);
};

export default ProductSetting;
