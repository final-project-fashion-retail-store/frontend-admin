export type UserChatSidebarType = {
	_id: string;
	name: string;
	email: string;
	avatar: {
		url: string;
		public_id: string;
	};
	lastMessage: string;
	lastMessageAt: string;
	isRead: boolean;
};
