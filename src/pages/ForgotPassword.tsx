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
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';

const formSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address',
	}),
});

const ForgotPassword = () => {
	const [isSendingEmail, forgotPassword] = useAuthStore(
		useShallow((state) => [state.isSendingEmail, state.forgotPassword])
	);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const errorMessage = await forgotPassword(values);
		if (errorMessage) {
			form.setError('email', {
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
							Password Recovery
						</h2>
						<p className='text-sm text-center md:text-left'>
							Don't worry! It happens to the best of us. Enter your email address below
							and we'll send you a reset link.
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
					<p className='text-foreground/60'>
						Enter your email address and we'll send you instructions to reset your
						password.
					</p>
					<div className='w-full max-w-lg mx-auto'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-5 sm:space-y-8'
							>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-sm sm:text-base'>Email Address</FormLabel>
											<FormControl>
												<Input
													className='h-10 text-sm sm:text-base'
													placeholder='Enter your registered email'
													autoComplete='email'
													{...field}
												/>
											</FormControl>
											<FormMessage className='text-xs sm:text-sm' />
										</FormItem>
									)}
								/>
								<Button
									className='cursor-pointer w-full bg-foreground'
									type='submit'
									size={'lg'}
									disabled={isSendingEmail}
								>
									{isSendingEmail ? (
										<HugeiconsIcon
											icon={Orbit01Icon}
											className='animate-spin'
										/>
									) : (
										'Send Reset Link'
									)}
								</Button>
								<div className='w-full flex flex-row justify-center'>
									<p className='text-foreground/45 text-sm pr-2'>
										Remember your password?
									</p>
									<Link
										to={'/forgot-password'}
										className='text-sm relative group'
									>
										<span className='relative inline-block pb-1.5 overflow-hidden'>
											Forgot Password?
											<span className='absolute bottom-0 left-0 w-full h-[2px] bg-foreground scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
										</span>
									</Link>
								</div>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
