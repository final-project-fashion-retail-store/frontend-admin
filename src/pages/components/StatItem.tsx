import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
	title: string;
	subContent: string;
	icon: React.ReactNode;
	content: number;
};

const StatItem = ({ title, subContent, icon, content }: Props) => {
	return (
		<Card className='md:flex-1'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-sm font-medium'>{title}</CardTitle>
				<span className='size-4 text-muted-foreground'>{icon}</span>
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{content}</div>
				<p className='text-xs text-muted-foreground'>{subContent}</p>
			</CardContent>
		</Card>
	);
};

export default StatItem;
