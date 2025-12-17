import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import useStatisticsStore from '@/store/statisticsStore';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Star } from 'lucide-react';
import { useEffect } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { useShallow } from 'zustand/react/shallow';

const DashboardTabProduct = () => {
	const [
		productRevenue,
		productRatings,
		// wishlistConversion,
		period,
		isGettingProductRevenue,
		isGettingProductRatings,
		// isGettingWishlistConversion,
		getProductRevenue,
		getProductRatings,
		getWishlistConversion,
	] = useStatisticsStore(
		useShallow((state) => [
			state.productRevenue,
			state.productRatings,
			// state.wishlistConversion,
			state.period,
			state.isGettingProductRevenue,
			state.isGettingProductRatings,
			// state.isGettingWishlistConversion,
			state.getProductRevenue,
			state.getProductRatings,
			state.getWishlistConversion,
		])
	);

	useEffect(() => {
		getProductRevenue(period);
		getProductRatings(period);
		getWishlistConversion(period);
	}, [getProductRatings, getProductRevenue, getWishlistConversion, period]);

	const productRevenueData =
		productRevenue?.map((item) => ({
			name:
				item.productName && item.productName.length > 20
					? item.productName.substring(0, 20) + '...'
					: item.productName,
			sales: item.totalQuantity,
			revenue: item.totalRevenue.toFixed(2),
		})) || [];

	const productRatingData =
		productRatings?.map((item) => ({
			stars: item.rating,
			count: item.count,
			percentage: item.percentage,
		})) || [];

	return (
		<TabsContent
			value='products'
			className='space-y-6'
		>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Product Performance */}
				<Card>
					<CardHeader>
						<CardTitle>Product Revenue Performance</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}
						>
							{isGettingProductRevenue ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								<BarChart data={productRevenueData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey='name'
										angle={-45}
										textAnchor='end'
										height={100}
									/>
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

				{/* Product Ratings */}
				<Card>
					<CardHeader>
						<CardTitle>Product Ratings Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{isGettingProductRatings ? (
								<div className='w-full h-full flex items-center justify-center'>
									<HugeiconsIcon
										icon={Orbit01Icon}
										className='animate-spin'
									/>
								</div>
							) : (
								productRatingData.map((rating) => (
									<div
										key={rating.stars}
										className='flex items-center gap-4'
									>
										<div className='flex items-center gap-1 w-16'>
											<span>{rating.stars}</span>
											<Star className='w-4 h-4 text-yellow-400 fill-current' />
										</div>
										<div className='flex-1 bg-gray-200 rounded-full h-2'>
											<div
												className='bg-yellow-400 h-2 rounded-full'
												style={{ width: `${rating.percentage}%` }}
											/>
										</div>
										<span className='text-sm text-gray-600 w-12'>{rating.count}</span>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Wishlist Conversion */}
			{/* <Card>
				<CardHeader>
					<CardTitle>Wishlist to Purchase Conversion</CardTitle>
				</CardHeader>
				<CardContent>
					{isGettingWishlistConversion ? (
						<div className='w-full h-full flex items-center justify-center'>
							<HugeiconsIcon
								icon={Orbit01Icon}
								className='animate-spin'
							/>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
							<div className='text-center p-4 bg-blue-50 rounded-lg'>
								<h4 className='font-semibold'>Total Wishlisted</h4>
								<p className='text-2xl font-bold text-blue-600'>
									{wishlistConversion?.totalWishlisted || 0}
								</p>
							</div>
							<div className='text-center p-4 bg-green-50 rounded-lg'>
								<h4 className='font-semibold'>Purchased</h4>
								<p className='text-2xl font-bold text-green-600'>
									{wishlistConversion?.totalPurchased || 0}
								</p>
							</div>
							<div className='text-center p-4 bg-purple-50 rounded-lg'>
								<h4 className='font-semibold'>Conversion Rate</h4>
								<p className='text-2xl font-bold text-purple-600'>
									{wishlistConversion?.conversionRate || 0}%
								</p>
							</div>
							<div className='text-center p-4 bg-orange-50 rounded-lg'>
								<h4 className='font-semibold'>Avg Time to Purchase</h4>
								<p className='text-2xl font-bold text-orange-600'>
									{wishlistConversion?.avgDaysToPurchase || 0} days
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card> */}
		</TabsContent>
	);
};

export default DashboardTabProduct;
