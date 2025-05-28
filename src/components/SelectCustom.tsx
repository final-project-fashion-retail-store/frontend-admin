import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type Props = {
	triggerPlaceHolder: string;
	items: {
		title: string;
		value: string;
	}[];
	className: string;
	defaultValue: string;
	onValueChange: (value: string) => void;
};

const SelectCustom = ({
	triggerPlaceHolder,
	items,
	className,
	defaultValue,
	onValueChange,
}: Props) => {
	return (
		<Select
			defaultValue={defaultValue}
			onValueChange={onValueChange}
		>
			<SelectTrigger className={`w-[180px] ${className}`}>
				<SelectValue placeholder={triggerPlaceHolder} />
			</SelectTrigger>
			<SelectContent>
				{items.map((item) => (
					<SelectItem
						key={item.value}
						value={item.value}
					>
						{item.title}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default SelectCustom;
