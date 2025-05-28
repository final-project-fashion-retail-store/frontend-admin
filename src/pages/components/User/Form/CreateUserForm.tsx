import { useState } from 'react';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

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
	phoneNumber: z.string().optional(), // Optional - not all users may have phone
	addressLine: z.string().optional(), // Optional - address may not be required
	city: z.string().optional(),
	district: z.string().optional(),
	ward: z.string().optional(),
	label: z.string().optional(),
});

const CreateUserForm = () => {
	const [imageUploaded, setImageUploaded] = useState<string>('');
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			addressLine: '',
			city: '',
			district: '',
			ward: '',
			label: '',
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-4 p-1'
			>
				{/* upload avatar */}
				<div className='w-full flex flex-col items-center space-y-4'>
					{imageUploaded ? (
						<div className='size-6 max-size-6'>
							<img
								src={imageUploaded}
								alt='avatar-preview'
							/>
						</div>
					) : (
						<div className='size-20 max-size-20 ring-4 ring-foreground/20 bg-accent rounded-full flex items-center justify-center'>
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

						<span className='text-xs text-muted-foreground'>Optional • Max 5MB</span>
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
							<FormLabel>Phone Number</FormLabel>
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
							<FormField
								control={form.control}
								name='city'
								render={({ field }) => (
									<FormItem className='flex-1'>
										<FormLabel>Province/City</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select province/city' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='Vinh Long'>Vinh Long</SelectItem>
												<SelectItem value='Can Tho'>Can Tho</SelectItem>
												<SelectItem value='Ho Chi Minh'>Ho Chi Minh</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='district'
								render={({ field }) => (
									<FormItem className='flex-1'>
										<FormLabel>District</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select district' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='Vinh Long'>Vinh Long</SelectItem>
												<SelectItem value='Can Tho'>Can Tho</SelectItem>
												<SelectItem value='Ho Chi Minh'>Ho Chi Minh</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='w-full flex flex-1 gap-4'>
							<FormField
								control={form.control}
								name='ward'
								render={({ field }) => (
									<FormItem className='flex-1'>
										<FormLabel>Ward/Commune</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select ward/commune' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='Vinh Long'>Vinh Long</SelectItem>
												<SelectItem value='Can Tho'>Can Tho</SelectItem>
												<SelectItem value='Ho Chi Minh'>Ho Chi Minh</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='label'
								render={({ field }) => (
									<FormItem className='flex-1'>
										<FormLabel>Label</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select label' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='Vinh Long'>Vinh Long</SelectItem>
												<SelectItem value='Can Tho'>Can Tho</SelectItem>
												<SelectItem value='Ho Chi Minh'>Ho Chi Minh</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>
				<div className='w-full flex items-center justify-end'>
					<Button type='submit'>Create</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreateUserForm;
