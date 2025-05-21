import { useAuthStore } from '@/store';

const Dashboard = () => {
	const authUser = useAuthStore((state) => state.authUser);
	return <div>This is dashboard page. Hello user {authUser?.fullName}</div>;
};

export default Dashboard;
