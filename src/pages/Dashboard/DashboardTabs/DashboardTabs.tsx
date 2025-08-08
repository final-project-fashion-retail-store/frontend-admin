import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardTabInventory from '@/pages/Dashboard/DashboardTabs/DashboardTabInventory';
import DashboardTabOverview from '@/pages/Dashboard/DashboardTabs/DashboardTabOverview';
import DashboardTabProduct from '@/pages/Dashboard/DashboardTabs/DashboardTabProduct';
import DashboardTabSale from '@/pages/Dashboard/DashboardTabs/DashboardTabSale';
import DashboardTabUser from '@/pages/Dashboard/DashboardTabs/DashboardTabUser';

const tabs = [
	{
		value: 'overview',
		label: 'Overview',
	},
	{
		value: 'users',
		label: 'Users',
	},
	{
		value: 'sales',
		label: 'Sales',
	},
	{
		value: 'products',
		label: 'Products',
	},
	{
		value: 'inventory',
		label: 'Inventory',
	},
];

const DashboardTabs = () => {
	return (
		<Tabs
			defaultValue='overview'
			className='space-y-6'
		>
			<TabsList className='grid w-full grid-cols-5'>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
					>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			<DashboardTabOverview />
			<DashboardTabUser />
			<DashboardTabSale />
			<DashboardTabProduct />
			<DashboardTabInventory />
		</Tabs>
	);
};

export default DashboardTabs;
