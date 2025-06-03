import { useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Overlay from '@/components/ui/overlay';
import { AxiosError } from 'axios';

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
});

type Props = {
	role: 'user' | 'staff';
	setIsCreatedUser?: Dispatch<SetStateAction<boolean>>;
	getImageAvatarId?: (public_url: string) => void;
};
const UserForm = ({ role, setIsCreatedUser, getImageAvatarId }: Props) => {
	const [
		isCreatingUser,
		isUpdatingUser,
		createUser,
		updateUser,
		getAllUsers,
		selectedUser,
	] = useManagementStore(
		useShallow((state) => [
			state.isCreatingUser,
			state.isUpdatingUser,
			state.createUser,
			state.updateUser,
			state.getAllUsers,
			state.selectedUser,
		])
	);
	const [isUploadingImages, isDestroyingImages, uploadImages, destroyImages] =
		useGeneralStore(
			useShallow((state) => [
				state.isUploadingImages,
				state.isDestroyingImages,
				state.uploadImages,
				state.destroyImages,
			])
		);
	const [imageUploaded, setImageUploaded] = useState<{
		secure_url: string;
		public_id: string;
	}>(
		selectedUser
			? {
					secure_url: selectedUser?.avatar.url,
					public_id: selectedUser?.avatar.public_id,
			  }
			: { secure_url: '', public_id: '' }
	);

	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: selectedUser
			? {
					firstName: selectedUser.firstName,
					lastName: selectedUser.lastName,
					email: selectedUser.email,
					phoneNumber: selectedUser.phoneNumber,
			  }
			: {
					firstName: '',
					lastName: '',
					email: '',
					phoneNumber: '',
			  },
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (
			isCreatingUser ||
			isUploadingImages ||
			isDestroyingImages ||
			isUpdatingUser
		)
			return;

		const data = {
			...values,
			role,
			avatar: {
				url: imageUploaded.secure_url,
				public_id: imageUploaded.public_id,
			},
		};

		let errMessage;

		if (selectedUser) {
			errMessage = await updateUser(selectedUser._id, data);
		} else {
			errMessage = await createUser(data);
		}

		if (errMessage) {
			form.setError('email', {
				type: 'custom',
				message: errMessage,
			});
			return;
		}

		await getAllUsers(role);

		setIsCreatedUser?.(true);

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
			// Destroy image first If any (update case)
			if (imageUploaded.public_id) {
				await destroyImages({ publicId: [imageUploaded.public_id] });
			}

			// Then upload new image
			const res = await uploadImages(formData);
			if (res && !Array.isArray(res)) {
				setImageUploaded(res);
				if (getImageAvatarId && res.public_id) {
					getImageAvatarId(res.public_id || '');
				}
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
			{(isUploadingImages || isDestroyingImages) && <Overlay />}
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
											disabled={!!selectedUser}
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
					onClick={() => {
						if (submitBtnRef.current) {
							submitBtnRef.current.click();
						}
					}}
				>
					Create
				</Button>
			</DialogFooter>
		</>
	);
};

export default UserForm;
