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
	onValueChange?: (value: string, fieldName: string) => void;
};

const SelectFormCustom = <T extends FieldValues>({
	control,
	name,
	label,
	placeholder = 'Select an option',
	items,
	className,
	required = false,
	onValueChange,
}: Props<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>
						{label} {required && <span className='text-destructive'>*</span>}
					</FormLabel>
					<Select
						onValueChange={(value) => {
							field.onChange(value);
							onValueChange?.(value, name);
						}}
						value={field.value}
					>
						<FormControl>
							<SelectTrigger className={className}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{items?.map((item) => (
								<SelectItem
									key={item.id}
									value={item.name}
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
