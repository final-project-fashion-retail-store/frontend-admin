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
import { useGeneralStore, useUserManagementStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import SelectFormCustom from '@/components/SelectFormCustom';
import { useEffect, useRef, useState } from 'react';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';

const labelItems = [
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
	email: z.string().email({
		message: 'Invalid email address',
	}),
	fullName: z.string().min(1, { message: 'Name is required' }),
	phoneNumber: z.string().regex(/^(0|\+84)[0-9]{9}$/, {
		message: 'Invalid phone number format',
	}),
	addressLine: z.string().min(1, { message: 'Address line is required' }),
	city: z.string().min(1, { message: 'City is required' }),
	district: z.string().min(1, { message: 'District is required' }),
	ward: z.string().min(1, { message: 'Ward is required' }),
	label: z.enum(['Home', 'Work', 'Other'], {
		message: 'Address label is required',
	}),
	isDefault: z.boolean().optional(),
});

const AddressForm = () => {
	const [provinces, districts, wards, getProvinces, getDistricts, getWards] =
		useGeneralStore(
			useShallow((state) => [
				state.provinces,
				state.districts,
				state.wards,
				state.getProvinces,
				state.getDistricts,
				state.getWards,
			])
		);
	const [
		isCreatingAddress,
		isUpdatingAddress,
		createAddress,
		updateAddress,
		selectedAddress,
		getAllAddresses,
	] = useUserManagementStore(
		useShallow((state) => [
			state.isCreatingAddress,
			state.isUpdatingAddress,
			state.createAddress,
			state.updateAddress,
			state.selectedAddress,
			state.getAllAddresses,
		])
	);

	const [selectedCity, setSelectedCity] = useState(selectedAddress?.city || '');
	const [selectedDistrict, setSelectedDistrict] = useState(
		selectedAddress?.district || ''
	);

	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: selectedAddress
			? {
					email: selectedAddress.user.email,
					fullName: selectedAddress.fullName,
					phoneNumber: selectedAddress.phoneNumber,
					addressLine: selectedAddress.addressLine,
					city: selectedAddress.city,
					district: selectedAddress.district,
					ward: selectedAddress.ward,
					label: selectedAddress.label,
					isDefault: selectedAddress.isDefault,
			  }
			: {
					email: '',
					fullName: '',
					phoneNumber: '',
					addressLine: '',
					city: '',
					district: '',
					ward: '',
					label: 'Home',
					isDefault: false,
			  },
	});

	useEffect(() => {
		getProvinces();
	}, [getProvinces]);

	useEffect(() => {
		if (selectedCity && provinces) {
			const province = provinces.find(
				(province) => province.name === selectedCity
			);
			if (province) {
				getDistricts(province.id);
			}
		}
	}, [selectedCity, provinces, getDistricts, form]);

	useEffect(() => {
		if (selectedDistrict && districts) {
			const district = districts.find(
				(district) => district.name === selectedDistrict
			);
			if (district) {
				getWards(district.id);
			}
		}
	}, [selectedDistrict, districts, getWards, form]);

	const handleChangeSelect = (value: string, fieldName: string) => {
		switch (fieldName) {
			case 'city':
				form.setValue('district', '');
				form.setValue('ward', '');
				setSelectedCity(value);
				break;
			case 'district':
				form.setValue('ward', '');
				setSelectedDistrict(value);
				break;
			case 'ward':
				break;
			default:
				console.log('Invalid field');
		}
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isCreatingAddress || isUpdatingAddress) return;

		let errMessage;
		if (selectedAddress) {
			errMessage = await updateAddress(selectedAddress._id, values);
		} else {
			errMessage = await createAddress(values);
		}

		if (errMessage) {
			form.setError('email', {
				type: 'custom',
				message: errMessage,
			});
			return;
		}

		if (closeBtnRef.current) {
			closeBtnRef.current.click();
		}
		await getAllAddresses();
	}

	return (
		<>
			<div className='flex-1 overflow-y-auto overflow-x-hidden px-2'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										User Email <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter email'
											{...field}
											disabled={!!selectedAddress && !!form.getValues('email')}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='fullName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Name <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter name'
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
						<FormField
							control={form.control}
							name='addressLine'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Address Line <span className='text-destructive'>*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter address line'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='w-full flex gap-4 max-md:flex-col'>
							<div className='flex-1'>
								<SelectFormCustom
									className='w-full'
									control={form.control}
									name='city'
									label='City'
									placeholder='Select City'
									items={provinces}
									passToValue='name'
									onValueChange={handleChangeSelect}
									required
								/>
							</div>
							<div className='flex-1'>
								<SelectFormCustom
									className='w-full'
									control={form.control}
									name='district'
									label='District'
									placeholder='Select District'
									items={districts}
									passToValue='name'
									onValueChange={handleChangeSelect}
									required
								/>
							</div>
						</div>
						<div className='w-full flex gap-4 max-md:flex-col'>
							<div className='flex-1'>
								<SelectFormCustom
									className='w-full'
									control={form.control}
									name='ward'
									label='Ward'
									placeholder='Select Ward'
									items={wards}
									passToValue='name'
									onValueChange={handleChangeSelect}
									required
								/>
							</div>
							<div className='flex-1'>
								<SelectFormCustom
									className='w-full'
									control={form.control}
									name='label'
									label='Label'
									placeholder='Select Label'
									items={labelItems}
									required
								/>
							</div>
						</div>
						<FormField
							control={form.control}
							name='isDefault'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={!!selectedAddress && form.getValues('isDefault')}
										/>
									</FormControl>
									<FormLabel>Default</FormLabel>
								</FormItem>
							)}
						/>
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
					{isCreatingAddress || isUpdatingAddress ? (
						<HugeiconsIcon
							icon={Orbit01Icon}
							className='animate-spin'
						/>
					) : selectedAddress ? (
						'Save change'
					) : (
						'Create'
					)}
				</Button>
			</DialogFooter>
		</>
	);
};

export default AddressForm;
