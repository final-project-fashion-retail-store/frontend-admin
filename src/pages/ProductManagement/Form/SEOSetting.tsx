import { CardContent } from '@/components/ui/card';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CardHeaderCustom from '@/pages/ProductManagement/Form/CardHeaderCustom';
import type { ProductFormValues } from '@/pages/ProductManagement/Form/ProductFormContainer';
import { Search } from 'lucide-react';
import { Fragment } from 'react';
import type { UseFormReturn } from 'react-hook-form';

type Props = {
	form: UseFormReturn<ProductFormValues>;
};

const SEOSetting = ({ form }: Props) => {
	return (
		<Fragment>
			<CardHeaderCustom
				Icon={Search}
				title='SEO Settings'
				iconClassName='size-5 text-pink-600'
			/>
			<CardContent className='space-y-4'>
				<FormField
					control={form.control}
					name='metaTitle'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Meta Title</FormLabel>
							<FormControl>
								<Input
									placeholder='SEO-friendly title (50-60 characters)'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='metaDescription'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Meta Description</FormLabel>
							<FormControl>
								<Textarea
									rows={2}
									placeholder='Brief description for search result (150-160 characters)'
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

export default SEOSetting;
