import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Truck, TrendingDown, Users } from 'lucide-react';

const DashboardTabOperation = () => {
	return (
		<TabsContent
			value='operations'
			className='space-y-6'
		>
			{/* Operational Metrics */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<Truck className='w-8 h-8 mx-auto mb-2 text-blue-600' />
							<h3 className='font-semibold'>Avg Fulfillment Time</h3>
							<p className='text-2xl font-bold'>2.3 days</p>
							<p className='text-sm text-green-500'>-0.5 days from last month</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<TrendingDown className='w-8 h-8 mx-auto mb-2 text-red-600' />
							<h3 className='font-semibold'>Return Rate</h3>
							<p className='text-2xl font-bold'>3.2%</p>
							<p className='text-sm text-red-500'>+0.3% from last month</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<Users className='w-8 h-8 mx-auto mb-2 text-green-600' />
							<h3 className='font-semibold'>Customer Satisfaction</h3>
							<p className='text-2xl font-bold'>4.6/5</p>
							<p className='text-sm text-green-500'>+0.1 from last month</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Financial Insights */}
			<Card>
				<CardHeader>
					<CardTitle>Financial Insights</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<div className='p-4 bg-blue-50 rounded-lg'>
							<h4 className='font-semibold text-blue-900'>Shipping Cost Ratio</h4>
							<p className='text-2xl font-bold text-blue-600'>8.5%</p>
							<p className='text-sm text-blue-700'>of total revenue</p>
						</div>
						<div className='p-4 bg-green-50 rounded-lg'>
							<h4 className='font-semibold text-green-900'>Payment Success Rate</h4>
							<p className='text-2xl font-bold text-green-600'>97.2%</p>
							<p className='text-sm text-green-700'>successful transactions</p>
						</div>
						<div className='p-4 bg-purple-50 rounded-lg'>
							<h4 className='font-semibold text-purple-900'>Tax Collection</h4>
							<p className='text-2xl font-bold text-purple-600'>$32,400</p>
							<p className='text-sm text-purple-700'>this month</p>
						</div>
						<div className='p-4 bg-orange-50 rounded-lg'>
							<h4 className='font-semibold text-orange-900'>Repeat Customer Rate</h4>
							<p className='text-2xl font-bold text-orange-600'>34%</p>
							<p className='text-sm text-orange-700'>of all customers</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	);
};

export default DashboardTabOperation;
