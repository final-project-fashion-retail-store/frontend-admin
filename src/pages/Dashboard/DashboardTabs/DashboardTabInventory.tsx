import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
	Package,
	AlertTriangle,
	TrendingUp,
	TrendingDown,
	Loader2,
} from 'lucide-react';
import useStatisticsStore from '@/store/statisticsStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef } from 'react';

const DashboardTabInventory = () => {
	const [
		inventoryMetrics,
		inventoryStatus,
		isGettingInventoryStatus,
		period,
		pagination,
		getInventoryMetrics,
		getInventoryStatus,
	] = useStatisticsStore(
		useShallow((state) => [
			state.inventoryMetrics,
			state.inventoryStatus,
			state.isGettingInventoryStatus,
			state.period,
			state.pagination,
			state.getInventoryMetrics,
			state.getInventoryStatus,
		])
	);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		getInventoryMetrics(period);
	}, [getInventoryMetrics, period]);

	useEffect(() => {
		getInventoryStatus();
	}, [getInventoryStatus]);

	const getNextPage = () => {
		if (pagination?.nextPage && !isGettingInventoryStatus) {
			getInventoryStatus(pagination.nextPage);
		}
	};

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

		// Check if scrolled to bottom (with small threshold)
		if (scrollTop + clientHeight >= scrollHeight - 10) {
			getNextPage();
		}
	};

	return (
		<TabsContent
			value='inventory'
			className='space-y-6'
		>
			{/* Inventory Overview */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<Package className='w-8 h-8 mx-auto mb-2 text-blue-600' />
							<h3 className='font-semibold'>Total Inventory Value</h3>
							<p className='text-2xl font-bold'>
								{inventoryMetrics?.totalInventoryValue.formatted}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<AlertTriangle className='w-8 h-8 mx-auto mb-2 text-red-600' />
							<h3 className='font-semibold'>Low Stock Items</h3>
							<p className='text-2xl font-bold text-red-600'>
								{inventoryMetrics?.lowStockItems.value}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<TrendingUp className='w-8 h-8 mx-auto mb-2 text-green-600' />
							<h3 className='font-semibold'>Stock Turnover</h3>
							<p className='text-2xl font-bold'>
								{inventoryMetrics?.stockTurnover.formatted}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='text-center'>
							<TrendingDown className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
							<h3 className='font-semibold'>Dead Stock</h3>
							<p className='text-2xl font-bold'>{inventoryMetrics?.deadStock.value}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Inventory Status Table */}
			<Card>
				<CardHeader>
					<CardTitle>Inventory Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						ref={scrollContainerRef}
						className='h-96 overflow-y-auto space-y-4 pr-2'
						onScroll={handleScroll}
					>
						{inventoryStatus?.map((item, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-4 border rounded-lg'
							>
								<div>
									<h4 className='font-medium'>{item.name}</h4>
									<div className='flex items-center gap-4 mt-1'>
										<span className='text-sm text-muted-foreground'>
											Available: {item.availableInventory}
										</span>
										<span className='text-sm text-muted-foreground'>
											Reserved: {item.totalReserved}
										</span>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<Badge
										variant={
											item.stockBadge === 'Low Stock' ? 'destructive' : 'secondary'
										}
									>
										{item.stockBadge}
									</Badge>
									<span className='font-medium'>{item.totalInventory} total</span>
								</div>
							</div>
						))}
						{isGettingInventoryStatus && (
							<div className='flex items-center justify-center p-4'>
								<Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	);
};

export default DashboardTabInventory;
