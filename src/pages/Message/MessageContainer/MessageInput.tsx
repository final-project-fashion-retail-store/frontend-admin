import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { useChatStore } from '@/store';
import { CornerDownLeft } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const MessageInput = () => {
	const [isSendingMessage, sendMessage, selectedCustomer] = useChatStore(
		useShallow((state) => [
			state.isSendingMessage,
			state.sendMessage,
			state.selectedCustomer,
		])
	);
	const [message, setMessage] = useState('');

	const handleClickSendMessage = () => {
		if (message.trim() === '') return;
		sendMessage(selectedCustomer?._id || '', message);
		setMessage('');
	};

	const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleClickSendMessage();
		}
	};

	return (
		<div className='absolute -bottom-0.5 left-0 right-0 rounded-none border-t p-1'>
			<ChatInput
				placeholder='Type your message here...'
				className='min-h-12 resize-none rounded-none border-0 p-3 shadow-none focus-visible:ring-0'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handlePressEnter}
			/>
			<div className='flex items-center p-3 pt-0'>
				{/* <Button
					variant='ghost'
					size='icon'
				>
					<Paperclip className='size-4' />
					<span className='sr-only'>Attach file</span>
				</Button>

				<Button
					variant='ghost'
					size='icon'
				>
					<Mic className='size-4' />
					<span className='sr-only'>Use Microphone</span>
				</Button> */}

				<Button
					size='sm'
					className='ml-auto gap-1.5'
					onClick={handleClickSendMessage}
					disabled={isSendingMessage}
				>
					Send Message
					<CornerDownLeft className='size-3.5' />
				</Button>
			</div>
		</div>
	);
};

export default MessageInput;
