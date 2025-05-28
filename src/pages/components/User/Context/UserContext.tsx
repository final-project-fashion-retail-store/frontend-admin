import { createContext } from 'react';

export type Context = {
	role: 'staff' | 'user';
	searchValue: string;
	active: boolean | '';
	sort: string;
	paginationLink: string;
	handleClickSortField: (field: 'email' | 'name') => void;
};

const UserContext = createContext<Context>({
	role: 'user',
	searchValue: '',
	active: '',
	sort: '',
	paginationLink: '',
	handleClickSortField: () => {},
});

export default UserContext;
