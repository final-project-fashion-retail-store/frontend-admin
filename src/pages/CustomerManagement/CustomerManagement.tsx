import TableCustom from '@/pages/components/Table/TableCustom';
import { useManagementStore } from '@/store';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const CustomerManagement = () => {
	const [getAllUsers] = useManagementStore(
		useShallow((state) => [state.getAllUsers])
	);
	useEffect(() => {
		getAllUsers('user');
	}, [getAllUsers]);

	return (
		<div className='w-full p-4 space-y-10'>
			{/* heading */}
			<div className='w-full'>
				<h1 className='font-black text-2xl'>Customer Management</h1>
				<p className='text-muted-foreground text-base'>
					Manage your customers and their information
				</p>
			</div>
			<div className='w-full'>
				<TableCustom />
			</div>
		</div>
	);
};

export default CustomerManagement;
