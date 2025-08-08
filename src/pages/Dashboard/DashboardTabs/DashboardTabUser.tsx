import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import useStatisticsStore from '@/store/statisticsStore';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { useShallow } from 'zustand/react/shallow';

const DashboardTabUser = () => {
	const [
		userActivities,
		orderByLocation,
		topCustomers,
		isGettingUserActivities,
		isGettingOrderByLocation,
		period,
		getUserActivities,
		getOrderByLocation,
		getTopCustomers,
	] = useStatisticsStore(
		useShallow((state) => [
			state.userActivities,
			state.orderByLocation,
			state.topCustomers,
			state.isGettingUserActivities,
			state.isGettingOrderByLocation,
			state.period,
			state.getUserActivities,
			state.getOrderByLocation,
			state.getTopCustomers,
		])
	);

	useEffect(() => {
		getUserActivities(period);
		getOrderByLocation(period);
		getTopCustomers(period);
	}, [period, getUserActivities, getOrderByLocation, getTopCustomers]);

	const userActivitiesData = userActivities?.map((activity) => ({
		month: new Date(activity.date).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
		}),
		newUsers: activity.newUsers,
		activeUsers: activity.activeUsers,
	}));

	const orderByLocationData = orderByLocation?.map((location) => ({
		city: location.city,
		orders: location.totalOrders,
		revenue: location.totalRevenue,
	}));

	return (
		<TabsContent
			value='users'
			className='space-y-6'
		>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* User Registration Trends */}
				<Card>
					<CardHeader>
						<CardTitle>User Registration & Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingUserActivities ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<LineChart data={userActivitiesData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='month' />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type='monotone'
										dataKey='newUsers'
										stroke='#3b82f6'
										name='New Users'
									/>
									<Line
										type='monotone'
										dataKey='activeUsers'
										stroke='#10b981'
										name='Active Users'
									/>
								</LineChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Geographic Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Orders by Location</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingOrderByLocation ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<BarChart data={orderByLocationData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='city' />
									<YAxis />
									<Tooltip />
									<Bar
										dataKey='orders'
										fill='#3b82f6'
									/>
								</BarChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Top Customers Table */}
			<Card>
				<CardHeader>
					<CardTitle>Top Customers</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{topCustomers?.map((customer, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-4 border rounded-lg'
							>
								<div>
									<h4 className='font-medium'>{customer.email}</h4>
									<p className='text-sm text-muted-foreground'>
										{customer.totalOrders} orders
									</p>
								</div>
								<div className='text-right'>
									<p className='font-medium'>${customer.totalSpent.toLocaleString()}</p>
									<p className='text-sm text-muted-foreground'>
										LTV: ${customer.ltv.toLocaleString()}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	);
};

export default DashboardTabUser;
