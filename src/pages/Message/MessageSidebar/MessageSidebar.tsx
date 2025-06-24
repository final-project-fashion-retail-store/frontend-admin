import { Separator } from '@/components/ui/separator';
import MessageSidebarHeader from '@/pages/Message/MessageSidebar/MessageSidebarHeader';
import MessageSidebarItem from '@/pages/Message/MessageSidebar/MessageSidebarItem';
import MessageSidebarItemSkeleton from '@/pages/Message/MessageSidebar/MessageSidebarItemSkeleton';
import { useChatStore } from '@/store';
import type { UserChatSidebarType } from '@/types';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const MessageSidebar = () => {
	const [
		isGettingCustomers,
		customers,
		getUserChatSidebar,
		setSelectedCustomer,
		readMessages,
		subscribeUpdateUserSidebar,
		unsubscribeUpdateUserSidebar,
		selectedCustomer,
		messages,
	] = useChatStore(
		useShallow((state) => [
			state.isGettingCustomers,
			state.customers,
			state.getUserChatSidebar,
			state.setSelectedCustomer,
			state.readMessages,
			state.subscribeUpdateUserSidebar,
			state.unsubscribeUpdateUserSidebar,
			state.selectedCustomer,
			state.messages,
		])
	);

	useEffect(() => {
		getUserChatSidebar();
	}, [getUserChatSidebar]);

	useEffect(() => {
		console.log('mounting to update user sidebar');
		subscribeUpdateUserSidebar();
		return () => {
			console.log('unmounting from update user sidebar');
			unsubscribeUpdateUserSidebar();
		};
	}, [subscribeUpdateUserSidebar, unsubscribeUpdateUserSidebar]);

	useEffect(() => {
		if (selectedCustomer && messages) {
			const isRead = messages.every((message) => message.isRead);
			if (!isRead) {
				readMessages(selectedCustomer._id);
			}
		}
	}, [messages, readMessages, selectedCustomer]);

	const handleClickCustomer = (customer: UserChatSidebarType) => {
		setSelectedCustomer(customer);
		if (customer.isRead) return;
		readMessages(customer._id);
	};

	return (
		<div className='w-1/5 max-xl:w-1/3 max-lg:w-full h-screen border overflow-hidden'>
			{/* heading */}
			<MessageSidebarHeader />
			<Separator className='my-2' />
			{/* items */}
			<div className='h-full max-h-full overflow-y-auto pb-10'>
				{customers &&
					customers.length > 0 &&
					!isGettingCustomers &&
					customers.map((customer) => (
						<MessageSidebarItem
							key={customer._id}
							data={customer}
							onClick={() => handleClickCustomer(customer)}
						/>
					))}
				{isGettingCustomers &&
					[...Array(5)].map((_, index) => (
						<MessageSidebarItemSkeleton key={index} />
					))}
			</div>
		</div>
	);
};

export default MessageSidebar;
