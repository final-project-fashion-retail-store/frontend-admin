import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import useStatisticsStore from '@/store/statisticsStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';

const DashboardTabSale = () => {
	const [
		categoryPerformances,
		profitMargins,
		// eCommerceMetrics,
		isGettingCategoryPerformances,
		isGettingProfitMargins,
		period,
		getCategoryPerformances,
		getProfitMargins,
		getECommerceMetrics,
	] = useStatisticsStore(
		useShallow((state) => [
			state.categoryPerformances,
			state.ProfitMargins,
			// state.eCommerceMetrics,
			state.isGettingCategoryPerformances,
			state.isGettingProfitMargins,
			state.period,
			state.getCategoryPerformances,
			state.getProfitMargins,
			state.getECommerceMetrics,
		])
	);

	useEffect(() => {
		getCategoryPerformances(period);
		getProfitMargins(period);
		getECommerceMetrics(period);
	}, [getCategoryPerformances, getProfitMargins, getECommerceMetrics, period]);

	const categoryPerformanceData =
		categoryPerformances?.map((item) => ({
			category: item.categoryName,
			revenue: item.totalRevenue,
			orders: item.totalOrders,
		})) || [];

	const profitMarginData =
		profitMargins?.map((item) => ({
			category: item.categoryName,
			margin: item.profitMargin,
		})) || [];

	return (
		<TabsContent
			value='sales'
			className='space-y-6'
		>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Category Performance */}
				<Card>
					<CardHeader>
						<CardTitle>Category Performance</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingCategoryPerformances ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<BarChart data={categoryPerformanceData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='category' />
									<YAxis />
									<Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
									<Bar
										dataKey='revenue'
										fill='#3b82f6'
									/>
								</BarChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Profit Margins */}
				<Card>
					<CardHeader>
						<CardTitle>Profit Margins by Category</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingProfitMargins ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<BarChart data={profitMarginData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='category' />
									<YAxis />
									<Tooltip formatter={(value) => [`${value}%`, '']} />
									<Bar
										dataKey='margin'
										fill='#10b981'
									/>
								</BarChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Sales Metrics */}
			{/* <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<h3 className='text-lg font-semibold'>Average Order Value</h3>
							<p className='text-3xl font-bold text-blue-600'>
								{eCommerceMetrics?.avgOrderValue?.formatted || '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<h3 className='text-lg font-semibold'>Conversion Rate</h3>
							<p className='text-3xl font-bold text-green-600'>
								{eCommerceMetrics?.conversionRate?.formatted || '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<h3 className='text-lg font-semibold'>Cart Abandonment</h3>
							<p className='text-3xl font-bold text-red-600'>
								{eCommerceMetrics?.cartAbandonment?.formatted || '0'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div> */}
		</TabsContent>
	);
};

export default DashboardTabSale;
