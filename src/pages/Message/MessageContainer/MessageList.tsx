import { Fragment, useEffect } from 'react';
import {
	ChatBubble,
	ChatBubbleAvatar,
	ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { useAuthStore, useChatStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import MessageListSkeleton from '@/pages/Message/MessageContainer/MessageListSkeleton';
import { formatMessageTime } from '@/utils/formatMessageTime';

const MessageList = () => {
	const authUser = useAuthStore((state) => state.authUser);
	const [
		messages,
		isGettingMessages,
		getMessages,
		selectedCustomer,
		subscribeToMessages,
		unsubscribeToMessages,
	] = useChatStore(
		useShallow((state) => [
			state.messages,
			state.isGettingMessages,
			state.getMessages,
			state.selectedCustomer,
			state.subscribeToMessages,
			state.unsubscribeToMessages,
		])
	);

	useEffect(() => {
		getMessages(selectedCustomer?._id || '');
		subscribeToMessages();
		return () => {
			unsubscribeToMessages();
		};
	}, [
		getMessages,
		selectedCustomer?._id,
		subscribeToMessages,
		unsubscribeToMessages,
	]);

	return (
		<div className='size-full max-h-full overflow-y-auto pb-50'>
			<ChatMessageList>
				{selectedCustomer &&
					!isGettingMessages &&
					messages?.map((message) => (
						<Fragment key={message._id}>
							<ChatBubble
								variant={message.sender === selectedCustomer._id ? 'received' : 'sent'}
							>
								<ChatBubbleAvatar
									src={
										message.sender === selectedCustomer._id
											? selectedCustomer.avatar.url
											: authUser?.avatar.url
									}
									fallback={message.sender === 'user' ? 'US' : 'AI'}
									className='object-cover'
								/>
								<div
									className={`flex flex-col gap-1 ${
										message.sender === selectedCustomer._id ? 'items-start' : 'items-end'
									}`}
								>
									<span className='text-[10px]'>
										{formatMessageTime(message.createdAt)}
									</span>
									<ChatBubbleMessage
										variant={
											message.sender === selectedCustomer._id ? 'received' : 'sent'
										}
									>
										{message.text}
									</ChatBubbleMessage>
								</div>
							</ChatBubble>
						</Fragment>
					))}
				{isGettingMessages && <MessageListSkeleton />}
				{/* <ChatBubble variant='received'>
					<ChatBubbleAvatar fallback='AI' />
					<ChatBubbleMessage isLoading />
				</ChatBubble> */}
			</ChatMessageList>
		</div>
	);
};

export default MessageList;
