import { useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

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
import { Upload, User } from 'lucide-react';
import { useGeneralStore, useManagementStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import SelectFormCustom from '@/components/SelectFormCustom';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Overlay from '@/components/ui/overlay';
import { AxiosError } from 'axios';

const addressLabelItems = [
	{
		id: 'Home',
		name: 'Home',
	},
	{
		id: 'Work',
		name: 'Work',
	},
	{
		id: 'Other',
		name: 'Other',
	},
];

const formSchema = z.object({
	firstName: z.string().min(1, {
		message: 'First name is required',
	}),
	lastName: z.string().min(1, {
		message: 'Last name is required',
	}),
	email: z.string().email({
		message: 'Invalid email address',
	}),
	phoneNumber: z
		.string()
		.min(1, {
			message: 'Phone number is required',
		})
		.regex(/^(0|\+84)[0-9]{9}$/, {
			message: 'Invalid phone number format',
		})
		.min(10, {
			message: 'Phone number must be at least 10 digits',
		}),
	addressLine: z.string().optional(),
	city: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional(),
	district: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional(),
	ward: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional(),
	label: z.string().optional(),
});

type Props = {
	getImageAvatarId?: (public_url: string) => void;
};
const CreateUserForm = ({ getImageAvatarId }: Props) => {
	const [isCreatingUser, createUser] = useManagementStore(
		useShallow((state) => [
			state.isCreatingUser,
			state.createUser,
		])
	);
	const [
		provinces,
		districts,
		wards,
		getProvinces,
		getDistricts,
		getWards,
		isUploadingImages,
		uploadImages,
	] = useGeneralStore(
		useShallow((state) => [
			state.provinces,
			state.districts,
			state.wards,
			state.getProvinces,
			state.getDistricts,
			state.getWards,
			state.isUploadingImages,
			state.uploadImages,
		])
	);
	const [imageUploaded, setImageUploaded] = useState<{
		secure_url: string;
		public_id: string;
	}>({ secure_url: '', public_id: '' });
	const [hasAddressLine, setHasAddressLine] = useState(false);

	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			addressLine: '',
			city: { id: '', name: '' },
			district: { id: '', name: '' },
			ward: { id: '', name: '' },
			label: 'Home',
		},
	});

	const { control, setValue, watch } = form;

	useEffect(() => {
		getProvinces();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const selectedCity = useWatch({ control, name: 'city' });
	const selectedDistrict = useWatch({ control, name: 'district' });
	const selectedWard = useWatch({ control, name: 'ward' });

	const provinceItems = useMemo(
		() => provinces?.map((p) => ({ id: p.id, name: p.name })) || [],
		[provinces]
	);
	const districtItems = useMemo(
		() => districts?.map((d) => ({ id: d.id, name: d.name })) || [],
		[districts]
	);
	const wardItems = useMemo(
		() => wards?.map((w) => ({ id: w.id, name: w.name })) || [],
		[wards]
	);

	useEffect(() => {
		const subscription = watch((value) => {
			setHasAddressLine(!!value.addressLine);
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	useEffect(() => {
		if (selectedCity?.id) {
			setValue('district', undefined);
			setValue('ward', undefined);
			getDistricts(selectedCity.id);
		}
	}, [selectedCity?.id, getDistricts, setValue]);

	useEffect(() => {
		if (selectedDistrict?.id) {
			setValue('ward', undefined);
			getWards(selectedDistrict.id);
		}
	}, [selectedDistrict?.id, getWards, setValue]);

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isCreatingUser || isUploadingImages) return;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { addressLine, city, district, ward, label, ...data } = values;

		const createUserData = {
			...data,
			role: 'user' as 'user' | 'staff',
			avatar: {
				url: imageUploaded.secure_url,
				public_id: imageUploaded.public_id,
			},
		};

		const errorMessage = await createUser(createUserData);

		if (errorMessage) {
			form.setError('email', {
				type: 'custom',
				message: errorMessage,
			});

			if (getImageAvatarId && imageUploaded.public_id) {
				getImageAvatarId(imageUploaded.public_id || '');
			}
			return;
		}

		// Close dialog when success
		if (closeBtnRef.current) {
			closeBtnRef.current.click();
		}
	}

	const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];

		if (!file) return;
		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file');
			return;
		}
		if (file.size > 50 * 1024 * 1024) {
			toast.error('File size exceeds 5MB');
			return;
		}

		const formData = new FormData();
		formData.append('images', file);

		try {
			// Then upload new image
			const res = await uploadImages(formData);
			if (res && !Array.isArray(res)) {
				setImageUploaded(res);
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error('Failed to upload avatar');
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		}
	};

	return (
		<>
			{(isUploadingImages || isCreatingUser) && <Overlay />}
			<div className='flex-1 overflow-y-auto overflow-x-hidden px-2'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 p-1'
					>
						{/* upload avatar */}
						<div className='w-full flex flex-col items-center space-y-4'>
							{imageUploaded.public_id ? (
								<div className='size-20 max-size-20 rounded-full'>
									<img
										className='object-cover size-full rounded-full'
										src={imageUploaded?.secure_url}
										alt='avatar-preview'
									/>
								</div>
							) : (
								<div
									className={`size-20 max-size-20 ring-4 ring-foreground/20 bg-accent rounded-full flex items-center justify-center ${
										isUploadingImages && 'animate-pulse'
									}`}
								>
									<User className='size-12 text-foreground/30' />
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
											<Upload /> Upload Avatar
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
							name='firstName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										First Name <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter first name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='lastName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Last Name <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter last name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Email <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phoneNumber'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Phone Number <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter phone number'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Address */}
						<div className='w-full'>
							<h3 className='font-semibold text-base py-2'>Address Information</h3>
							<div className='space-y-4'>
								<FormField
									control={form.control}
									name='addressLine'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address Line</FormLabel>
											<FormControl>
												<Input
													placeholder='Enter street address'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='w-full flex flex-1 gap-4'>
									<div className='w-full flex flex-1 gap-4'>
										<SelectFormCustom
											className='w-full'
											control={control}
											name='city'
											label='Province/City'
											placeholder='Select Province/City'
											items={provinceItems}
											forForm={'create user'}
										/>
										<SelectFormCustom
											className='w-full'
											control={control}
											name='district'
											label='District'
											placeholder='Select District'
											items={districtItems}
											disabled={
												!selectedCity?.id || (districts ? districts.length === 0 : false)
											}
											forForm={'create user'}
										/>
									</div>
								</div>

								<div className='w-full flex flex-1 gap-4'>
									<SelectFormCustom
										className='w-full'
										control={control}
										name='ward'
										label='Ward/Commune'
										placeholder='Select Ward/Commune'
										items={wardItems}
										disabled={
											!selectedDistrict?.id || (wards ? wards.length === 0 : false)
										}
										forForm={'create user'}
									/>
									<SelectFormCustom
										className='w-full'
										control={control}
										name='label'
										label='Address Label'
										placeholder='Select address label'
										items={
											addressLabelItems?.map((al) => ({ id: al.id, name: al.name })) || []
										}
									/>
								</div>
							</div>
						</div>
						<button
							ref={submitBtnRef}
							type='submit'
							className='hidden'
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
					disabled={
						(selectedCity?.id || hasAddressLine) &&
						(!selectedDistrict?.id || !selectedWard?.id || !hasAddressLine)
							? true
							: false
					}
					onClick={() => {
						if (submitBtnRef.current) {
							submitBtnRef.current.click();
						}
					}}
				>
					Save changes
				</Button>
			</DialogFooter>
		</>
	);
};

export default CreateUserForm;
