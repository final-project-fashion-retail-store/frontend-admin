import MessageContainerHeader from '@/pages/Message/MessageContainer/MessageContainerHeader';
import MessageContainerWelcome from '@/pages/Message/MessageContainer/MessageContainerWelcome';
import MessageInput from '@/pages/Message/MessageContainer/MessageInput';
import MessageList from '@/pages/Message/MessageContainer/MessageList';
import { useChatStore } from '@/store';

const MessageContainer = () => {
	const selectedCustomer = useChatStore((state) => state.selectedCustomer);

	if (!selectedCustomer) {
		return <MessageContainerWelcome />;
	}

	return (
		<div className='w-4/5 max-xl:w-2/3 max-lg:w-full h-screen overflow-hidden relative'>
			<MessageContainerHeader />
			{/* Chat bubble */}
			<MessageList />
			<MessageInput />
		</div>
	);
};

export default MessageContainer;
