import { Fragment } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Tag } from 'lucide-react';

import type { ProductFormValues } from '@/pages/ProductManagement/Form/ProductFormContainer';
import { CardContent } from '@/components/ui/card';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import CardHeaderCustom from '@/pages/ProductManagement/Form/CardHeaderCustom';

type Props = {
	form: UseFormReturn<ProductFormValues>;
};

const Description = ({ form }: Props) => {
	return (
		<Fragment>
			<CardHeaderCustom
				title='Product Description'
				Icon={Tag}
				iconClassName='size-5 text-teal-600'
			/>
			<CardContent className='space-y-4'>
				<FormField
					control={form.control}
					name='shortDescription'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Short Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Brief product description'
									rows={2}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Description</FormLabel>
							<FormControl>
								<Textarea
									rows={2}
									placeholder='Detailed product description'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Fragment>
	);
};

export default Description;
