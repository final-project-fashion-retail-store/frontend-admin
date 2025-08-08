import DashboardHeader from '@/pages/Dashboard/DashboardHeader';
import ComprehensiveMetrics from '@/pages/Dashboard/ComprehensiveMetrics';
import DashboardTabs from '@/pages/Dashboard/DashboardTabs/DashboardTabs';

const Dashboard = () => {
	return (
		<div className='w-full p-8 space-y-10'>
			<DashboardHeader
				title='Analytics Dashboard'
				description='Comprehensive business insights and performance metrics'
			/>
			<ComprehensiveMetrics />
			<DashboardTabs />
		</div>
	);
};

export default Dashboard;
