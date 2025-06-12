import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useThemeStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

const themeOptions: { value: string; label: string }[] = [
	{
		value: 'light',
		label: 'Light',
	},
	{
		value: 'dark',
		label: 'Dark',
	},
	{
		value: 'system',
		label: 'System',
	},
];

const ThemeSelection = () => {
	const [theme, setTheme] = useThemeStore(
		useShallow((state) => [state.theme, state.setTheme])
	);

	return (
		<RadioGroup
			defaultValue={theme}
			onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
			className='flex flex-row gap-2'
		>
			{themeOptions.map((option) => (
				<div
					key={option.value}
					className='flex items-center space-x-2'
				>
					<RadioGroupItem
						value={option.value}
						checked={theme === option.value}
						id='r1'
					/>
					<Label htmlFor='r1'>{option.label}</Label>
				</div>
			))}
		</RadioGroup>
	);
};

export default ThemeSelection;
