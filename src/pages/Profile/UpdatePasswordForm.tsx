import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import Overlay from '@/components/ui/overlay';
import { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z
	.object({
		username: z.string().optional(),
		oldPassword: z
			.string()
			.min(6, {
				message: 'Password must be at least 6 characters',
			})
			.regex(/[A-Z]/, {
				message: 'Password must contain at least one uppercase letter',
			})
			.regex(/[0-9]/, { message: 'Password must contain at least one number' }),
		newPassword: z
			.string()
			.min(6, {
				message: 'Password must be at least 6 characters',
			})
			.regex(/[A-Z]/, {
				message: 'Password must contain at least one uppercase letter',
			})
			.regex(/[0-9]/, { message: 'Password must contain at least one number' }),
		passwordConfirm: z.string(),
	})
	.refine((data) => data.newPassword === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['passwordConfirm'], // Shows the error on confirmPassword field
	});

const UpdatePasswordForm = () => {
	const [authUser, isChangingPassword, changePassword] = useAuthStore(
		useShallow((state) => [
			state.authUser,
			state.isChangingPassword,
			state.changePassword,
		])
	);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const closeRef = useRef<HTMLButtonElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			oldPassword: '',
			newPassword: '',
			passwordConfirm: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isChangingPassword) return;
		const errMessage = await changePassword(values);

		if (errMessage) {
			form.setError('oldPassword', {
				type: 'custom',
				message: errMessage,
			});
		} else {
			closeRef.current?.click();
		}
	}

	return (
		<Form {...form}>
			{isChangingPassword && <Overlay />}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-4'
			>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem className='hidden'>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									{...field}
									type='text'
									autoComplete='username'
									readOnly
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='oldPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Old Password</FormLabel>
							<FormControl>
								<div className='h-10 relative'>
									<Input
										{...field}
										type={showCurrentPassword ? 'text' : 'password'}
										autoComplete='current-password'
										placeholder='Current Password'
									/>
									<div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
										{showCurrentPassword ? (
											<Eye
												className='cursor-pointer size-5'
												onClick={() => setShowCurrentPassword(false)}
											/>
										) : (
											<EyeOff
												className='cursor-pointer size-5'
												onClick={() => setShowCurrentPassword(true)}
											/>
										)}
									</div>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='newPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<div className='h-10 relative'>
									<Input
										{...field}
										type={showNewPassword ? 'text' : 'password'}
										autoComplete='new-password'
										placeholder='New Password'
									/>
									<div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
										{showNewPassword ? (
											<Eye
												className='cursor-pointer size-5'
												onClick={() => setShowNewPassword(false)}
											/>
										) : (
											<EyeOff
												className='cursor-pointer size-5'
												onClick={() => setShowNewPassword(true)}
											/>
										)}
									</div>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='passwordConfirm'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<div className='h-10 relative'>
									<Input
										{...field}
										type={showPasswordConfirm ? 'text' : 'password'}
										autoComplete='new-password'
										placeholder='Confirm Password'
									/>
									<div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
										{showPasswordConfirm ? (
											<Eye
												className='cursor-pointer size-5'
												onClick={() => setShowPasswordConfirm(false)}
											/>
										) : (
											<EyeOff
												className='cursor-pointer size-5'
												onClick={() => setShowPasswordConfirm(true)}
											/>
										)}
									</div>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter>
					<DialogClose
						ref={closeRef}
						className='hidden'
					/>
					<Button type='submit'>Update Password</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};

export default UpdatePasswordForm;
