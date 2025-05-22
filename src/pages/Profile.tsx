import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Camera02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import Overlay from '@/components/ui/overlay';

const formSchema = z.object({
	firstName: z
		.string()
		.min(2, 'First name must be at least 2 characters')
		.max(20, 'First name must be less than 20 characters'),
	lastName: z
		.string()
		.min(2, 'Last name must be at least 2 characters')
		.max(20, 'Last name must be less than 20 characters'),
	phoneNumber: z
		.string()
		.regex(
			/^(0|\+84)[0-9]{9}$/,
			'Please enter a valid 10-digit Vietnam phone number'
		)
		.optional()
		.or(z.literal('')),
});

const Profile = () => {
	const [authUser, isUpdatingProfile, updateProfile] = useAuthStore(
		useShallow((state) => [
			state.authUser,
			state.isUpdatingProfile,
			state.updateProfile,
		])
	);
	const [allowUpdate, setAllowUpdate] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: authUser?.firstName || '',
			lastName: authUser?.lastName || '',
			phoneNumber: authUser?.phoneNumber || '',
		},
	});

	// Check if form values have changed compared to original data
	useEffect(() => {
		const subscription = form.watch((value) => {
			const hasChanged =
				value.firstName !== authUser?.firstName ||
				value.lastName !== authUser?.lastName ||
				value.phoneNumber !== authUser?.phoneNumber;

			setAllowUpdate(hasChanged);
		});

		return () => subscription.unsubscribe();
	}, [form, authUser]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isUpdatingProfile) return;

		// If the error is undefined, it means the login was successful
		const error = await updateProfile(values);
		if (error) {
			form.setError('firstName', {
				type: 'custom',
			});
			form.setError('lastName', {
				type: 'custom',
				message: error,
			});
			form.setError('phoneNumber', {
				type: 'custom',
				message: error,
			});
		}
	}
	return (
		<div className='w-full px-2'>
			{isUpdatingProfile && <Overlay />}
			{/* Heading */}
			<h2 className='font-semibold text-xl'>Profile</h2>
			<Separator className='my-4' />
			{/* Body */}
			<div className='w-full'>
				{/* avatar */}
				<div className='w-full flex items-center justify-center gap-2'>
					<label htmlFor='avatar'>
						<div className='size-18 cursor-pointer relative group'>
							<Avatar className='size-full ring ring-foreground'>
								<AvatarImage
									src={authUser?.avatar}
									alt='Avatar'
								/>
								<AvatarFallback>FB</AvatarFallback>
							</Avatar>
							{/* camera icon */}
							<span className='flex items-center justify-center bg-secondary ring-1 ring-foreground/50 rounded-full size-8 absolute -bottom-2 right-0 transition-opacity ease-linear duration-150 opacity-0 group-hover:opacity-100'>
								<HugeiconsIcon
									icon={Camera02Icon}
									size={20}
								/>
							</span>
						</div>
						<input
							id='avatar'
							type='file'
							accept='image/*'
							hidden
						/>
					</label>
					<div className='flex flex-col items-start justify-center'>
						{/* user info */}
						<p className='font-semibold text-lg'>{authUser?.fullName}</p>
						<p className='text-foreground/70 text-sm'>{authUser?.role}</p>
						<p className='text-foreground/70 text-sm'>{authUser?.email}</p>
					</div>
				</div>
				{/* form */}
				<div className='w-[60%] mx-auto mt-6'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8'
						>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												autoComplete='first-name'
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
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												autoComplete='last-name'
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
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input
												{...field}
												autoComplete='tel'
												placeholder='+84'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type='submit'
								disabled={!allowUpdate || isUpdatingProfile}
							>
								Update profile
							</Button>
						</form>
					</Form>
					<Separator className='my-8' />
					{/* Change password */}
					<div className='w-full flex flex-col justify-center items-start gap-2'>
						<span className='text-sm font-medium'>Password</span>
						<Button variant={'outline'}>Change your password</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
