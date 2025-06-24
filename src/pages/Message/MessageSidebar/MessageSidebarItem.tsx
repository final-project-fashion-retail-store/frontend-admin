import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore, useChatStore } from '@/store';
import type { UserChatSidebarType } from '@/types';
import { formatChatTime } from '@/utils/formatChatTime';

type Props = {
	data: UserChatSidebarType;
	onClick?: () => void;
};

const MessageSidebarItem = ({ data, onClick }: Props) => {
	const onlineUsers = useAuthStore((state) => state.onlineUsers);
	const selectedCustomer = useChatStore((state) => state.selectedCustomer);

	return (
		<div className='w-full'>
			<div className='w-full p-2'>
				<div
					className={`w-full p-2 flex items-start gap-2 border-2 border-transparent rounded-lg hover:bg-accent cursor-pointer select-none ${
						selectedCustomer?._id === data._id &&
						'border-primary/40! bg-primary/10 hover:bg-primary/10'
					}`}
					onClick={onClick}
				>
					<div className='size-12 relative shrink-0'>
						<Avatar className='size-full'>
							<AvatarImage
								className='object-cover'
								src={data.avatar.url}
								alt='Avatar'
							/>
							<AvatarFallback>AB</AvatarFallback>
						</Avatar>
						{onlineUsers.includes(data._id) && (
							<span className='bg-emerald-500 size-2 ring-2 ring-background rounded-full absolute bottom-0 right-1' />
						)}
					</div>
					<div className='min-w-0'>
						<div className='flex items-center justify-between'>
							<p className={`truncate mr-2 ${!data.isRead ? 'font-bold' : ''}`}>
								{data.name}
							</p>
							<p
								className={`shrink-0 text-sm text-muted-foreground ${
									!data.isRead ? 'font-bold text-foreground!' : ''
								}`}
							>
								{formatChatTime(data.lastMessageAt)}
							</p>
						</div>
						{/* <p
							className={`text-sm text-muted-foreground truncate ${
								!data.isRead ? 'text-foreground!' : ''
							}`}
						>
							{data.email}
						</p> */}
						<p
							className={`text-sm truncate text-muted-foreground ${
								!data.isRead ? 'text-foreground!' : ''
							}`}
						>
							{data.lastMessage || 'No messages yet'}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessageSidebarItem;
