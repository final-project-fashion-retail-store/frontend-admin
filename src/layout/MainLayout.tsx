import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import CustomSidebarTrigger from '@/components/CustomSidebarTrigger';

const MainLayout = () => {
	const defaultOpen = Cookies.get('sidebar_state') === 'true';

	return (
		<SidebarProvider
			defaultOpen={defaultOpen}
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as React.CSSProperties
			}
		>
			<AppSidebar />
			<SidebarInset className='min-w-0'>
				<main className='flex-1 '>
					<div className='max-md:flex hidden w-full h-12 p-2 border-b flex-row items-center justify-start'>
						<span className='hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-row items-center justify-center rounded-md p-2 transition-colors duration-200'>
							<div className='size-4 flex flex-row items-center justify-center'>
								<CustomSidebarTrigger />
							</div>
						</span>
					</div>
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default MainLayout;
