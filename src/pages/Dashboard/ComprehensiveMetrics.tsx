import StatCard from '@/pages/Dashboard/StatCard';
import useStatisticsStore from '@/store/statisticsStore';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const ComprehensiveMetrics = () => {
	const [insights, getInsights, period] = useStatisticsStore(
		useShallow((state) => [state.insights, state.getInsights, state.period])
	);

	useEffect(() => {
		getInsights(period);
	}, [period, getInsights]);

	if (!insights) return null;
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
			<StatCard
				title='Total Revenue'
				value={insights.totalRevenue.value}
				change={insights.totalRevenue.change}
				icon={DollarSign}
				trend={
					insights.totalRevenue.change === 0
						? ''
						: insights.totalRevenue.change > 0
						? 'up'
						: 'down'
				}
			/>
			<StatCard
				title='Total Orders'
				value={insights.totalOrders.value}
				change={insights.totalOrders.change}
				icon={ShoppingCart}
				trend={
					insights.totalOrders.change === 0
						? ''
						: insights.totalOrders.change > 0
						? 'up'
						: 'down'
				}
			/>
			<StatCard
				title='Active Users'
				value={insights.activeUsers.value}
				icon={Users}
			/>
			<StatCard
				title='Avg Order Value'
				value={insights.avgOrderValue.value}
				change={insights.avgOrderValue.change}
				icon={TrendingUp}
				trend={
					insights.avgOrderValue.change === 0
						? ''
						: insights.avgOrderValue.change > 0
						? 'up'
						: 'down'
				}
			/>
		</div>
	);
};

export default ComprehensiveMetrics;
