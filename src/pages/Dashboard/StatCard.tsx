import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';

type Props = {
	title: string;
	value: number;
	change?: number;
	icon: LucideIcon;
	trend?: 'up' | 'down' | '';
};

const StatCard = ({
	title,
	value,
	change = 0,
	icon: Icon,
	trend = '',
}: Props) => (
	<Card>
		<CardContent className='p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm font-medium text-muted-foreground'>{title}</p>
					<p className='text-2xl font-bold'>{value.toFixed(0)}</p>
					<div className='flex items-center mt-1'>
						{trend === 'up' && <TrendingUp className='w-4 h-4 text-green-500 mr-1' />}
						{trend === 'down' && (
							<TrendingDown className='w-4 h-4 text-red-500 mr-1' />
						)}
						{change > 0 && (
							<span
								className={`text-sm ${
									trend === 'up' ? 'text-green-500' : 'text-red-500'
								}`}
							>
								{change}
							</span>
						)}
					</div>
				</div>
				<div className='p-3 bg-blue-50 rounded-full'>
					<Icon className='w-6 h-6 text-blue-600' />
				</div>
			</div>
		</CardContent>
	</Card>
);

export default StatCard;
