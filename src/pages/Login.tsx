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
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';

const formSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address',
	}),
	password: z.string().min(6, {
		message: 'Password must be at least 8 characters',
	}),
});

const Login = () => {
	const [login, isLoggingIn] = useAuthStore(
		useShallow((state) => [state.login, state.isLoggingIn])
	);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isLoggingIn) return;

		// If the error is undefined, it means the login was successful
		const error = await login(values);
		if (error) {
			form.setError('email', {
				type: 'custom',
				message: error,
			});
			form.setError('password', {
				type: 'custom',
				message: error,
			});
		}
	}

	return (
		<div className='w-screen h-screen p-4 flex items-center justify-center'>
			<div className='w-full max-w-6xl min-h-[420px] flex flex-col md:flex-row rounded-lg shadow-custom overflow-hidden'>
				<div className='w-full md:w-1/3 bg-[#886de4] px-6 sm:px-10 py-10 sm:py-16 md:py-20 rounded-t-lg md:rounded-t-none md:rounded-l-lg flex items-center justify-center'>
					<div className='text-white flex flex-col items-center md:items-start space-y-4 max-w-xs'>
						<h2 className='font-bold text-xl text-center md:text-left'>
							Welcome back
						</h2>
						<p className='text-sm text-center md:text-left'>
							Enter your credentials to access the management dashboard and take
							control of your business.
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
						Management Login
					</h1>
					<div className='w-full max-w-lg mx-auto'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-5 sm:space-y-8'
							>
								{/* Form fields... */}

								{/* Improved form fields */}
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-sm sm:text-base'>Email</FormLabel>
											<FormControl>
												<Input
													className='h-10 text-sm sm:text-base'
													placeholder='Enter your email'
													autoComplete='email'
													{...field}
												/>
											</FormControl>
											<FormMessage className='text-xs sm:text-sm' />
										</FormItem>
									)}
								/>

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
											<FormMessage className='text-xs sm:text-sm' />
										</FormItem>
									)}
								/>

								<Button
									className='cursor-pointer w-full'
									type='submit'
									size={'lg'}
									disabled={isLoggingIn}
								>
									{isLoggingIn ? (
										<HugeiconsIcon
											icon={Orbit01Icon}
											className='animate-spin'
										/>
									) : (
										'Login'
									)}
								</Button>
								<Link
									to={'/forgot-password'}
									className='text-sm relative group'
								>
									<span className='relative inline-block pb-1.5 overflow-hidden'>
										Forgot Password?
										<span className='absolute bottom-0 left-0 w-full h-[2px] bg-foreground scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
									</span>
								</Link>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
