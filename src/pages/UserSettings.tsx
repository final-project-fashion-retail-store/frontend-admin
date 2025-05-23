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
		<div className='w-screen h-screen flex items-center justify-center'>
			<div className='w-[90%] h-[90%] border rounded-2xl p-6 px-12'>
				{/* heading */}
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='font-black text-2xl'>Settings</h1>
						<p className='text-base text-muted-foreground'>
							Manage your account settings
						</p>
					</div>
					<Link
						to={'/'}
						className='size-12 border border-accent-foreground rounded-full flex items-center justify-center cursor-pointer transition transition-color duration-200 ease-in-out hover:bg-accent'
					>
						<HugeiconsIcon
							icon={Cancel02Icon}
							size={32}
						/>
					</Link>
				</div>
				<Separator className='my-4' />
				{/* body */}
				<div className='w-full flex flex-row gap-4'>
					{/* menu */}
					<div className='w-1/6 flex flex-col gap-2'>
						{menuItems.map((item, index) => (
							<Link
								key={index}
								to={item.path}
								className={`font-semibold hover:underline p-2 rounded-md ${
									location.pathname.includes(item.path) && 'bg-sidebar-accent'
								}`}
							>
								{item.title}
							</Link>
						))}
					</div>
					{/* content */}
					<div className='w-5/6'>
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserSettings;
