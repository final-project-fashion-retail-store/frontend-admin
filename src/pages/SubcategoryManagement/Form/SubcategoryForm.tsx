import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useProductManagementStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef } from 'react';
import SelectFormCustom from '@/components/SelectFormCustom';

const formSchema = z.object({
	name: z.string().min(1, { message: 'Category name is required' }),
	parentCategory: z.string().min(1, { message: 'Parent category is required' }),
});

const SubcategoryForm = () => {
	const [
		isCreatingSubcategory,
		isUpdatingSubcategory,
		createSubcategory,
		updateSubcategory,
		selectedSubcategory,
		getSubcategories,
		categories,
		getCategories,
	] = useProductManagementStore(
		useShallow((state) => [
			state.isCreatingSubcategory,
			state.isUpdatingSubcategory,
			state.createSubcategory,
			state.updateSubcategory,
			state.selectedSubcategory,
			state.getSubcategories,
			state.categories,
			state.getCategories,
		])
	);

	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	const parentItems =
		categories?.map((category) => ({
			id: category._id,
			name: category.name,
		})) || null;

	useEffect(() => {
		if (categories) return;

		getCategories('', '', '', '', 100);
	}, [categories, getCategories]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: selectedSubcategory
			? {
					name: selectedSubcategory?.name,
					parentCategory: selectedSubcategory.parentCategory._id,
			  }
			: {
					name: '',
					parentCategory: '',
			  },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isCreatingSubcategory || isUpdatingSubcategory) return;

		let errMessage;
		if (selectedSubcategory) {
			errMessage = await updateSubcategory(selectedSubcategory._id, values);
		} else {
			errMessage = await createSubcategory(values);
		}

		if (errMessage) {
			form.setError('name', {
				type: 'custom',
				message: errMessage,
			});
			return;
		}

		if (closeBtnRef.current) {
			closeBtnRef.current.click();
		}
		await getSubcategories();
	}

	return (
		<>
			<div className='flex-1 overflow-y-auto overflow-x-hidden px-2'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Subcategory Name <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter subcategory name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SelectFormCustom
							className='w-full'
							control={form.control}
							name='parentCategory'
							label='Parent Category'
							placeholder='Select parent category'
							items={parentItems}
							required
						/>
						<Button
							ref={submitBtnRef}
							type='submit'
							hidden
						/>
					</form>
				</Form>
			</div>
			<DialogFooter>
				<DialogClose asChild>
					<Button
						ref={closeBtnRef}
						type='button'
						variant='outline'
					>
						Close
					</Button>
				</DialogClose>
				<Button
					type='submit'
					disabled={false}
					onClick={() => {
						if (submitBtnRef.current) {
							submitBtnRef.current.click();
						}
					}}
				>
					{isCreatingSubcategory || isUpdatingSubcategory ? (
						<HugeiconsIcon
							icon={Orbit01Icon}
							className='animate-spin'
						/>
					) : selectedSubcategory ? (
						'Save change'
					) : (
						'Create'
					)}
				</Button>
			</DialogFooter>
		</>
	);
};

export default SubcategoryForm;
