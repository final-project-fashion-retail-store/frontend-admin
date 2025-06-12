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
import { useRef } from 'react';

const formSchema = z.object({
	name: z.string().min(1, { message: 'Category name is required' }),
});

const CategoryForm = () => {
	const [
		isCreatingCategory,
		isUpdatingCategory,
		createCategory,
		updateCategory,
		selectedCategory,
		getCategories,
	] = useProductManagementStore(
		useShallow((state) => [
			state.isCreatingCategory,
			state.isUpdatingCategory,
			state.createCategory,
			state.updateCategory,
			state.selectedCategory,
			state.getCategories,
		])
	);

	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: selectedCategory || {
			name: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isCreatingCategory || isUpdatingCategory) return;

		let errMessage;
		if (selectedCategory) {
			errMessage = await updateCategory(selectedCategory._id, values);
		} else {
			errMessage = await createCategory(values);
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
		await getCategories();
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
										Category Name <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter category name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
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
					{isCreatingCategory || isUpdatingCategory ? (
						<HugeiconsIcon
							icon={Orbit01Icon}
							className='animate-spin'
						/>
					) : selectedCategory ? (
						'Save change'
					) : (
						'Create'
					)}
				</Button>
			</DialogFooter>
		</>
	);
};

export default CategoryForm;
