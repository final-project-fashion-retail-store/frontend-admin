import { Skeleton } from '@/components/ui/skeleton';

const MessageSidebarItemSkeleton = () => {
	return (
		<div className='w-full'>
			<div className='w-full p-2'>
				<div className='w-full p-2 flex items-start gap-2 border-2 border-transparent rounded-lg'>
					<div className='size-12 relative shrink-0'>
						<Skeleton className='size-full rounded-full' />
						<Skeleton className='size-2 rounded-full absolute bottom-0 right-1' />
					</div>
					<div className='min-w-0 flex-1 space-y-1.5'>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-5 w-24' />
							<Skeleton className='h-4 w-16' />
						</div>
						<Skeleton className='h-4 w-40' />
						<Skeleton className='h-4 w-full' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessageSidebarItemSkeleton;
