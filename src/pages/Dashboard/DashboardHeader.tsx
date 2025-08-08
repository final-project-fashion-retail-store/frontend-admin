import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import useStatisticsStore from '@/store/statisticsStore';
import { useEffect, useState } from 'react';

const selectValues = [
	{
		value: '7days',
		label: 'Last 7 days',
	},
	{
		value: '30days',
		label: 'Last 30 days',
	},
	{
		value: '3months',
		label: 'Last 3 months',
	},
	{
		value: '6months',
		label: 'Last 6 months',
	},
	{
		value: '1year',
		label: 'Last year',
	},
];

type Props = {
	title: string;
	description: string;
	className?: string;
};

const DashboardHeader = ({ title, description, className }: Props) => {
	const setPeriod = useStatisticsStore((state) => state.setPeriod);
	const [timeRange, setTimeRange] = useState<string>('6months');

	useEffect(() => {
		setPeriod(timeRange);
	}, [timeRange, setPeriod]);
	return (
		<div className={`w-full flex justify-between items-center ${className}`}>
			<div>
				<h1 className='font-black text-2xl max-md:text-lg'>{title}</h1>
				<p className='text-muted-foreground text-base max-md:text-sm'>
					{description}
				</p>
			</div>

			<Select
				value={timeRange}
				onValueChange={setTimeRange}
			>
				<SelectTrigger className='w-40'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{selectValues.map((item) => (
						<SelectItem
							key={item.value}
							value={item.value}
						>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default DashboardHeader;
