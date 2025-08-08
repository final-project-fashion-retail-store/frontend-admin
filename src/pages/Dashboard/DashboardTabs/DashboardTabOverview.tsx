import {
	ResponsiveContainer,
	AreaChart,
	Area,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import useStatisticsStore from '@/store/statisticsStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';

const paymentMethodColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const orderStatusColors = [
	'#10b981',
	'#3b82f6',
	'#f59e0b',
	'#6b7280',
	'#ef4444',
];

const DashboardTabOverview = () => {
	const [
		revenueTrends,
		paymentMethods,
		orderStatus,
		topProducts,
		isGettingRevenueTrends,
		isGettingPaymentMethods,
		isGettingOrderStatus,
		isGettingTopProducts,
		period,
		getRevenueTrends,
		getPaymentMethods,
		getOrderStatus,
		getTopProducts,
	] = useStatisticsStore(
		useShallow((state) => [
			state.revenueTrends,
			state.paymentMethods,
			state.orderStatus,
			state.topProducts,
			state.isGettingRevenueTrends,
			state.isGettingPaymentMethods,
			state.isGettingOrderStatus,
			state.isGettingTopProducts,
			state.period,
			state.getRevenueTrends,
			state.getPaymentMethods,
			state.getOrderStatus,
			state.getTopProducts,
		])
	);

	useEffect(() => {
		getRevenueTrends(period);
		getPaymentMethods(period);
		getOrderStatus(period);
		getTopProducts(period);
	}, [
		period,
		getRevenueTrends,
		getPaymentMethods,
		getOrderStatus,
		getTopProducts,
	]);

	const revenueTrendsData =
		revenueTrends?.map((item) => {
			const date = new Date(item.date);
			return {
				month: date.toLocaleDateString(undefined, {
					month: 'short',
					day: 'numeric',
				}),
				revenue: item.revenue || 0,
				profit: item.profit || 0,
			};
		}) || [];

	const paymentMethodData =
		paymentMethods?.map((item, index) => ({
			name: item.method,
			value: Number(item.percentage),
			color: paymentMethodColors[index % paymentMethodColors.length],
		})) || [];

	const orderStatusData =
		orderStatus?.map((item, index) => ({
			name: item.status,
			value: Number(item.percentage),
			color: orderStatusColors[index % orderStatusColors.length],
		})) || [];

	const topProductsData =
		topProducts?.map((item) => ({
			name:
				item.productName && item.productName.length > 20
					? item.productName.substring(0, 20) + '...'
					: item.productName,
			sales: item.totalQuantity,
			revenue: item.totalRevenue.toFixed(2),
		})) || [];

	return (
		<TabsContent
			value='overview'
			className='space-y-6'
		>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Revenue Trend */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue & Profit Trends</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingRevenueTrends ||
							!revenueTrendsData ||
							revenueTrendsData.length === 0 ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<AreaChart data={revenueTrendsData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='month' />
									<YAxis />
									<Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
									<Area
										type='monotone'
										dataKey='revenue'
										stackId='1'
										stroke='#3b82f6'
										fill='#3b82f6'
										fillOpacity={0.6}
									/>
									<Area
										type='monotone'
										dataKey='profit'
										stackId='2'
										stroke='#10b981'
										fill='#10b981'
										fillOpacity={0.6}
									/>
								</AreaChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Payment Methods */}
				<Card>
					<CardHeader>
						<CardTitle>Payment Method Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingPaymentMethods ||
							!paymentMethodData ||
							paymentMethodData.length === 0 ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<PieChart>
									<Pie
										data={paymentMethodData}
										cx='50%'
										cy='50%'
										outerRadius={80}
										dataKey='value'
										label={({ name, value }) => `${name}: ${value}%`}
									>
										{paymentMethodData?.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.color}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Order Status */}
				<Card>
					<CardHeader>
						<CardTitle>Order Status Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingOrderStatus ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<PieChart>
									<Pie
										data={orderStatusData}
										cx='50%'
										cy='50%'
										outerRadius={80}
										dataKey='value'
										label={({ name, value }) => `${name}: ${value}%`}
									>
										{orderStatusData?.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.color}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Top Products */}
				<Card>
					<CardHeader>
						<CardTitle>Top Selling Products</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingTopProducts ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<BarChart data={topProductsData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey='name'
										angle={-45}
										textAnchor='end'
										height={100}
										interval={0}
										tick={{ fontSize: 10 }}
									/>
									<YAxis />
									<Tooltip formatter={(value) => [value, 'Sales']} />
									<Bar
										dataKey='sales'
										fill='#3b82f6'
									/>
								</BarChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</TabsContent>
	);
};

export default DashboardTabOverview;
