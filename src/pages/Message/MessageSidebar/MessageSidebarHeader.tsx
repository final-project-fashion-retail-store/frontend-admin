import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const MessageSidebarHeader = () => {
	return (
		<div className='w-full p-4 space-y-4'>
			<h1 className='font-black text-2xl'>Messages</h1>
			<label className='relative'>
				<Input
					className='pl-10 h-10'
					type='text'
					placeholder='Search customer...'
				/>
				<span className='absolute top-1/2 left-3 -translate-y-1/2 size-5'>
					<Search className='text-muted-foreground size-full' />
				</span>
			</label>
		</div>
	);
};

export default MessageSidebarHeader;
