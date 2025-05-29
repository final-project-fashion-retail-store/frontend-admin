import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type SelectItem = {
	id: string;
	name: string;
};

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: FieldPath<T>;
	label: string;
	placeholder?: string;
	items: SelectItem[] | null;
	className?: string;
	forForm?: 'create user' | '';
	required?: boolean;
	disabled?: boolean;
};

const SelectFormCustom = <T extends FieldValues>({
	control,
	name,
	label,
	placeholder = 'Select an option',
	items,
	className,
	forForm = '',
	required = false,
	disabled = false,
}: Props<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className='flex-1'>
					<FormLabel>
						{label} {required && <span className='text-destructive'>*</span>}
					</FormLabel>
					<Select
						onValueChange={(value) => {
							if (forForm === 'create user') {
								const selectedItem = items?.find((item) => item.id === value);
								field.onChange(selectedItem);
							} else {
								field.onChange(value);
							}
						}}
						value={forForm === 'create user' ? field.value?.id : field.value}
						disabled={disabled}
					>
						<FormControl>
							<SelectTrigger className={className}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{items &&
								items.length > 0 &&
								items.map((item) => (
									<SelectItem
										key={item.id}
										value={item.id}
									>
										{item.name}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default SelectFormCustom;
