import MessageContainer from '@/pages/Message/MessageContainer/MessageContainer';
import MessageSidebar from '@/pages/Message/MessageSidebar/MessageSidebar';
import { useChatStore } from '@/store';

const Message = () => {
	const selectedCustomer = useChatStore((state) => state.selectedCustomer);

	return (
		<div className='size-full'>
			<div className='size-full hidden lg:flex'>
				<MessageSidebar />
				<MessageContainer />
			</div>
			<div className='w-full h-[calc(100vh-4rem)] hidden max-lg:flex'>
				{selectedCustomer ? <MessageContainer /> : <MessageSidebar />}
			</div>
		</div>
	);
};

export default Message;
