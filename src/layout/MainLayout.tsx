import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const MainLayout = () => {
	const defaultOpen = Cookies.get('sidebar_state') === 'true';

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<SidebarTrigger />
			<main>
				<Outlet />
			</main>
		</SidebarProvider>
	);
};

export default MainLayout;
