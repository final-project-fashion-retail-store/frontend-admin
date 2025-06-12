import { CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

type Props = {
	Icon: LucideIcon;
	title: string;
	iconClassName?: string;
};

const CardHeaderCustom = ({ Icon, title, iconClassName }: Props) => {
	return (
		<CardHeader>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Icon className={iconClassName} />
					<CardTitle>{title}</CardTitle>
				</div>
			</div>
		</CardHeader>
	);
};

export default CardHeaderCustom;
