import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store';
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

const UpdateForm = () => {
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
	);
};

export default UpdateForm;
