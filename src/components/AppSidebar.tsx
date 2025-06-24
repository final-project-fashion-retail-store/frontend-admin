import CustomSidebarTrigger from '@/components/CustomSidebarTrigger';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Overlay from '@/components/ui/overlay';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	// SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store';
import {
	// Calendar03Icon,
	// Home02Icon,
	// MessengerIcon,
	// SearchAreaIcon,
	// Settings02Icon,
	UnfoldMoreIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
	ChevronDown,
	House,
	ListTodo,
	ListTree,
	LocationEdit,
	LogOut,
	MessageSquareText,
	Sparkles,
	UserCheck,
	UserRoundCog,
	Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const items = [
	{
		title: 'Dashboard',
		url: 'dashboard',
		icon: <House />,
	},
	{
		title: 'User Management',
		url: '#',
		icon: <Users />,
		dropdownItems: [
			{
				title: 'Customer',
				url: 'manage-customers',
				icon: <Users />,
			},
			{
				title: 'Staff',
				url: 'manage-employees',
				icon: <UserCheck />,
			},
			{
				title: 'Address',
				url: 'manage-addresses',
				icon: <LocationEdit />,
			},
		],
	},
	{
		title: 'Product Management',
		url: '#',
		icon: <ListTodo />,
		dropdownItems: [
			{
				title: 'Product',
				url: 'manage-products',
				icon: <ListTodo />,
			},
			{
				title: 'Category',
				url: 'manage-categories',
				icon: <ListTree />,
			},
			{
				title: 'Subcategory',
				url: 'manage-subcategories',
				icon: <ListTree />,
			},
			{
				title: 'Brand',
				url: 'manage-brands',
				icon: <Sparkles />,
			},
		],
	},
	{
		title: 'Messages',
		url: 'messages',
		icon: <MessageSquareText />,
	},
];

export function AppSidebar() {
	const [authUser, isLoggingOut, logout] = useAuthStore(
		useShallow((state) => [state.authUser, state.isLoggingOut, state.logout])
	);

	return (
		<Sidebar
			variant='floating'
			collapsible='icon'
		>
			{isLoggingOut && <Overlay />}
			<SidebarHeader className='hidden md:flex'>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='w-8'
						>
							<span>
								<CustomSidebarTrigger />
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{/* Dashboard */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								if (!item?.dropdownItems) {
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												<Link
													to={item.url}
													aria-disabled={
														item.title === 'Messages' && authUser?.role === 'admin'
													}
												>
													{item.icon}
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								}
								return (
									<SidebarMenuItem key={item.title}>
										<Collapsible className='group/collapsible'>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton
													disabled={
														item.title === 'User Management' && authUser?.role === 'staff'
													}
												>
													{item.icon}
													<span>{item.title}</span>
													<ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.dropdownItems.map((dropdownItem) => (
														<SidebarMenuSubItem key={dropdownItem.title}>
															<SidebarMenuSubButton asChild>
																<Link to={dropdownItem.url}>
																	{dropdownItem.icon}
																	<span>{dropdownItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</Collapsible>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size='lg'
									className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer'
								>
									<Avatar className='size-8'>
										<AvatarImage
											src={authUser?.avatar?.url}
											alt='User avatar'
										/>
										<AvatarFallback>PB</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-semibold'>{authUser?.fullName}</span>
										<span className='truncate text-xs text-sidebar-foreground/70'>
											{authUser?.email}
										</span>
									</div>
									<HugeiconsIcon
										icon={UnfoldMoreIcon}
										className='ml-auto size-4'
									/>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side='right'
								align='end'
								className='min-w-56 w-full rounded-lg'
							>
								<div className='flex items-center gap-2 p-2'>
									<Avatar className='h-8 w-8'>
										<AvatarImage
											src={authUser?.avatar?.url}
											alt='User avatar'
										/>
										<AvatarFallback>PB</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-semibold'>{authUser?.fullName}</span>
										<span className='truncate text-xs text-sidebar-foreground/70'>
											{authUser?.email}
										</span>
									</div>
								</div>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									asChild
									className='cursor-pointer'
								>
									<Link to={'/setting'}>
										<UserRoundCog className='text-foreground' />
										<span>Account</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className='cursor-pointer'
									onClick={() => logout()}
								>
									<LogOut className='text-foreground' />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
