import StatItem from '@/pages/components/StatItem';
import { useProductManagementStore } from '@/store';
import { Package, Star } from 'lucide-react';

const statItems = [
	{
		title: 'Total Brands',
		subContent: 'active',
		icon: <Package className='size-full' />,
	},
	{
		title: 'Featured Brands',
		subContent: 'Featured on homepage',
		icon: <Star className='size-full' />,
	},
	{
		title: 'Total Products',
		subContent: 'Across all brands',
		icon: <Package className='size-full' />,
	},
];

const Stats = () => {
	const brandStats = useProductManagementStore((state) => state.brandStats);

	return (
		<div className='w-full flex flex-col md:flex-row gap-1 md:gap-6'>
			{statItems.map((item) => (
				<StatItem
					key={item.title}
					title={item.title}
					subContent={
						item.title === 'Total Brands'
							? `${brandStats?.activeBrands} active`
							: item.subContent
					}
					icon={item.icon}
					content={
						item.title === 'Total Brands'
							? brandStats?.totalBrands || 0
							: item.title === 'Featured Brands'
							? brandStats?.featuredBrands || 0
							: brandStats?.totalProducts || 0
					}
				/>
			))}
		</div>
	);
};

export default Stats;
