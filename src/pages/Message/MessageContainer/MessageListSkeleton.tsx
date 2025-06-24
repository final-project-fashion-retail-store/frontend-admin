import {
	ChatBubble,
	ChatBubbleAvatar,
	ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { Fragment } from 'react';

const MessageListSkeleton = () => {
	return (
		<>
			{[...Array(3)].map((_, index) => (
				<Fragment key={index}>
					<ChatBubble variant='sent'>
						<ChatBubbleAvatar className='animate-pulse bg-accent' />
						<ChatBubbleMessage
							className='animate-pulse bg-accent min-w-80 h-18'
							variant='sent'
						></ChatBubbleMessage>
					</ChatBubble>
					<ChatBubble variant='received'>
						<ChatBubbleAvatar className='animate-pulse bg-accent' />
						<ChatBubbleMessage
							className='animate-pulse bg-accent min-w-80 h-18'
							variant='received'
						></ChatBubbleMessage>
					</ChatBubble>
				</Fragment>
			))}
		</>
	);
};

export default MessageListSkeleton;
