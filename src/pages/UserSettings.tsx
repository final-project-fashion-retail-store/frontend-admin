import { Separator } from '@/components/ui/separator';
import { Cancel02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const menuItems = [
	{
		path: 'profile',
		title: 'Profile',
	},
	{
		path: 'appearance',
		title: 'Appearance',
	},
];

const UserSettings = () => {
	const location = useLocation();
	return (
		<div className='w-screen h-screen 2xl:flex items-center justify-center'>
			<div className='2xl:w-[90%] 2xl:h-[90%] 2xl:border-2 2xl:rounded-2xl p-6 px-12 max-md:px-6 2xl:overflow-hidden'>
				{/* heading */}
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='font-black text-2xl max-md:text-xl'>Settings</h1>
						<p className='text-base max-md:text-sm text-muted-foreground'>
							Manage your account settings
						</p>
					</div>
					<Link
						to={'/'}
						className='size-12 max-md:size-10 border border-accent-foreground rounded-full flex items-center justify-center cursor-pointer transition transition-color duration-200 ease-in-out hover:bg-accent'
					>
						<HugeiconsIcon
							icon={Cancel02Icon}
							size={32}
						/>
					</Link>
				</div>
				<Separator className='my-4' />
				{/* body */}
				<div className='w-full flex 2xl:flex-row flex-col gap-4'>
					{/* menu */}
					<div className='2xl:w-1/6 w-full flex 2xl:flex-col flex-row gap-2'>
						{menuItems.map((item, index) => (
							<Link
								key={index}
								to={item.path}
								className={`font-semibold hover:underline p-2 rounded-md max-md:text-base ${
									location.pathname.includes(item.path) && 'bg-sidebar-accent'
								}`}
							>
								{item.title}
							</Link>
						))}
					</div>
					{/* content */}
					<div className='2xl:w-5/6 w-full'>
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserSettings;
