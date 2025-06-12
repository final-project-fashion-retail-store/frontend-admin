import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useGeneralStore, useProductManagementStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { useRef } from 'react';
import { Switch } from '@/components/ui/switch';
import Overlay from '@/components/ui/overlay';
import { Image, Upload } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
	name: z.string().min(1, { message: 'Category name is required' }),
	featuredBrand: z.boolean().optional(),
});

type Props = {
	setIsCreatedBrand: React.Dispatch<React.SetStateAction<boolean>>;
};

const CategoryForm = ({ setIsCreatedBrand }: Props) => {
	const [
		isCreatingBrand,
		isUpdatingBrand,
		createBrand,
		updateBrand,
		selectedBrand,
		getBrands,
	] = useProductManagementStore(
		useShallow((state) => [
			state.isCreatingBrand,
			state.isUpdatingBrand,
			state.createBrand,
			state.updateBrand,
			state.selectedBrand,
			state.getBrands,
		])
	);
	const [
		isUploadingImages,
		isDestroyingImages,
		uploadImages,
		destroyImages,
		uploadedImages,
	] = useGeneralStore(
		useShallow((state) => [
			state.isUploadingImages,
			state.isDestroyingImages,
			state.uploadImages,
			state.destroyImages,
			state.uploadedImages,
		])
	);

	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: selectedBrand
			? {
					name: selectedBrand?.name,
					featuredBrand: selectedBrand?.featuredBrand,
			  }
			: {
					name: '',
					featuredBrand: false,
			  },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isCreatingBrand || isUpdatingBrand) return;
		const adequateData = {
			...values,
			logo: {
				url: uploadedImages?.[0].secure_url || '',
				public_id: uploadedImages?.[0].public_id || '',
			},
		};
		let errMessage;
		if (selectedBrand) {
			errMessage = await updateBrand(selectedBrand._id, adequateData);
		} else {
			errMessage = await createBrand(adequateData);
		}

		if (errMessage) {
			form.setError('name', {
				type: 'custom',
				message: errMessage,
			});
			return;
		}

		setIsCreatedBrand(true);

		if (closeBtnRef.current) {
			closeBtnRef.current.click();
		}

		await getBrands();
	}

	const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];

		if (!file) return;
		if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
			toast.error('Please select an image file or vector');
			return;
		}
		if (file.size > 50 * 1024 * 1024) {
			toast.error('File size exceeds 5MB');
			return;
		}

		const formData = new FormData();
		formData.append('images', file);

		if (uploadedImages?.[0].public_id) {
			await destroyImages({ publicId: [uploadedImages?.[0].public_id] });
		}

		await uploadImages(formData);
	};

	return (
		<>
			{(isUploadingImages || isDestroyingImages) && <Overlay />}
			<div className='flex-1 overflow-y-auto overflow-x-hidden px-2'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						{/* Upload logo */}
						<div className='w-full flex flex-col items-center space-y-4 pt-1'>
							{uploadedImages?.[0].public_id ? (
								<div className='size-20 max-size-20 rounded-lg'>
									<img
										className={`${
											uploadedImages[0].secure_url.endsWith('.svg')
												? 'object-contain'
												: 'object-cover'
										} size-full rounded-lg`}
										src={uploadedImages?.[0]?.secure_url}
										alt='avatar-preview'
									/>
								</div>
							) : (
								<div
									className={`size-20 max-size-20 ring-4 ring-foreground/20 bg-accent rounded-lg flex items-center justify-center ${
										isUploadingImages && 'animate-pulse'
									}`}
								>
									<Image className='size-12 text-foreground/30' />
								</div>
							)}
							<div className='flex flex-col items-center space-y-1'>
								<label htmlFor='upload-avatar'>
									<input
										id='upload-avatar'
										type='file'
										accept='image/*'
										hidden
										onChange={(e) => handleUploadAvatar(e)}
									/>
									<Button
										className='cursor-pointer'
										variant={'outline'}
										asChild
									>
										<span>
											<Upload /> Upload Logo
										</span>
									</Button>
								</label>

								<span className='text-xs text-muted-foreground'>
									Optional • Max 5MB
								</span>
							</div>
						</div>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Brand Name <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter brand name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='pr-2'>
							<FormField
								control={form.control}
								name='featuredBrand'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between'>
										<div className='space-y-2'>
											<FormLabel>Featured Brand</FormLabel>
											<FormDescription>Show on homepage</FormDescription>
										</div>
										<FormControl>
											<Switch
												className='scale-140'
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
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
					{isCreatingBrand || isUpdatingBrand ? (
						<HugeiconsIcon
							icon={Orbit01Icon}
							className='animate-spin'
						/>
					) : selectedBrand ? (
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
