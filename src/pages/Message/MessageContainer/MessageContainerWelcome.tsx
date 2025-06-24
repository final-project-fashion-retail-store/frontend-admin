import { MessageSquare } from 'lucide-react';

const MessageContainerWelcome = () => {
	return (
		<div className='w-4/5 h-screen'>
			<div className='size-full flex flex-col items-center justify-center'>
				<span className='size-15 animate-bounce bg-primary/90 flex items-center justify-center rounded-lg'>
					<MessageSquare className='size-8 text-white' />
				</span>
				<h1 className='text-2xl font-bold'>Welcome to the Chat Application</h1>
				<p className='text-muted-foreground max-w-md text-center'>
					Start a conversation by selecting a customer from the sidebar. Your
					messages will appear here.
				</p>
			</div>
		</div>
	);
};

export default MessageContainerWelcome;
