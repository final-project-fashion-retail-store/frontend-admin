import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/ui/overlay';

const Dashboard = () => {
	const [authUser, logout, isLoggingOut] = useAuthStore(
		useShallow((state) => [state.authUser, state.logout, state.isLoggingOut])
	);
	return (
		<div>
			{isLoggingOut && <Overlay />}
			This is dashboard page. Hello user {authUser?.fullName}
			<Button onClick={() => logout()}>Logout</Button>
		</div>
	);
};

export default Dashboard;
