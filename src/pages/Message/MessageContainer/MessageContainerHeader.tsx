import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore, useChatStore } from '@/store';
import { X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

const MessageContainerHeader = () => {
	const onlineUsers = useAuthStore((state) => state.onlineUsers);
	const [selectedCustomer, setSelectedCustomer] = useChatStore(
		useShallow((state) => [state.selectedCustomer, state.setSelectedCustomer])
	);
	return (
		<div className='w-full p-4 border-b max-md:bg-accent max-md:border-foreground/30'>
			<div className='w-full flex items-center justify-between'>
				<div className='w-full flex items-center gap-4'>
					<div className='size-14 relative shrink-0'>
						<Avatar className='size-full'>
							<AvatarImage
								src={selectedCustomer?.avatar?.url || ''}
								alt='Avatar'
							/>
							<AvatarFallback>AB</AvatarFallback>
						</Avatar>
						{onlineUsers.includes(selectedCustomer?._id || '') && (
							<span className='bg-emerald-500 size-2 ring-2 ring-background rounded-full absolute bottom-0 right-1' />
						)}
					</div>
					<div className='flex flex-col'>
						<h2 className='text-lg font-semibold'>{selectedCustomer?.name}</h2>
						<p className='text-sm text-muted-foreground'>{selectedCustomer?.email}</p>
						<p className='text-sm text-muted-foreground'>
							{onlineUsers.includes(selectedCustomer?._id || '')
								? 'Online'
								: 'Offline'}
						</p>
					</div>
				</div>
				<Button
					className='hidden max-lg:flex'
					onClick={() => setSelectedCustomer(null)}
				>
					<X />
				</Button>
			</div>
		</div>
	);
};

export default MessageContainerHeader;
