import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const formSchema = z
	.object({
		password: z
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
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['passwordConfirm'], // Shows the error on confirmPassword field
	});

const ResetPassword = () => {
	const [isResettingPassword, resetPassword] = useAuthStore(
		useShallow((state) => [state.isResettingPassword, state.resetPassword])
	);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const { resetPasswordToken } = useParams();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: '',
			passwordConfirm: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const errorMessage = await resetPassword(values, resetPasswordToken || '');
		if (errorMessage) {
			form.setError('password', {
				type: 'custom',
				message: errorMessage,
			});
		}
	}

	return (
		<div className='w-screen h-screen p-4 flex items-center justify-center'>
			<div className='w-full max-w-6xl min-h-[420px] flex flex-col md:flex-row rounded-lg shadow-custom overflow-hidden'>
				<div className='w-full md:w-1/3 bg-[#886de4] px-6 sm:px-10 py-10 sm:py-16 md:py-20 rounded-t-lg md:rounded-t-none md:rounded-l-lg flex items-center justify-center'>
					<div className='text-white flex flex-col items-center md:items-start space-y-4 max-w-xs'>
						<h2 className='font-bold text-xl text-center md:text-left'>
							Reset Your Password
						</h2>
						<p className='text-sm text-center md:text-left'>
							Don't worry! It happens to the best of us. Create a new secure password
							for your account.
						</p>
						<div className='flex justify-center w-full'>
							<img
								className='size-24 md:size-28 object-contain'
								src='/icon-no-background.png'
								alt='Icon'
							/>
						</div>
					</div>
				</div>
				<div className='w-full md:w-2/3 flex flex-col p-6 sm:p-8 md:p-12 gap-4 sm:gap-6'>
					<h1 className='text-center text-xl sm:text-2xl font-black'>
						Forgot Password
					</h1>
					<p className='text-foreground/60 text-center'>
						Please enter and confirm your new password below.
					</p>
					<div className='w-full max-w-lg mx-auto'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-5 sm:space-y-8'
							>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-sm sm:text-base'>Password</FormLabel>
											<FormControl>
												<div className='h-10 relative'>
													<Input
														className='h-full text-sm sm:text-base pr-10'
														placeholder='Enter your password'
														type={showPassword ? 'text' : 'password'}
														{...field}
														autoComplete='current-password'
													/>
													<div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
														{showPassword ? (
															<Eye
																className='cursor-pointer'
																onClick={() => setShowPassword(false)}
															/>
														) : (
															<EyeOff
																className='cursor-pointer'
																onClick={() => setShowPassword(true)}
															/>
														)}
													</div>
												</div>
											</FormControl>
											<FormDescription className='text-xs'>
												Password must be at least 6 characters and include uppercase,
												lowercase, number.
											</FormDescription>
											<FormMessage className='text-xs sm:text-sm' />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='passwordConfirm'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-sm sm:text-base'>
												Confirm Password
											</FormLabel>
											<FormControl>
												<div className='h-10 relative'>
													<Input
														className='h-full text-sm sm:text-base pr-10'
														placeholder='Enter your password again'
														type={showPasswordConfirm ? 'text' : 'password'}
														{...field}
														autoComplete='current-password'
													/>
													<div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
														{showPasswordConfirm ? (
															<Eye
																className='cursor-pointer'
																onClick={() => setShowPasswordConfirm(false)}
															/>
														) : (
															<EyeOff
																className='cursor-pointer'
																onClick={() => setShowPasswordConfirm(true)}
															/>
														)}
													</div>
												</div>
											</FormControl>
											<FormMessage className='text-xs sm:text-sm' />
										</FormItem>
									)}
								/>
								<Button
									className='cursor-pointer w-full bg-foreground'
									type='submit'
									size={'lg'}
									disabled={isResettingPassword}
								>
									{isResettingPassword ? (
										<HugeiconsIcon
											icon={Orbit01Icon}
											className='animate-spin'
										/>
									) : (
										'Reset Password'
									)}
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
