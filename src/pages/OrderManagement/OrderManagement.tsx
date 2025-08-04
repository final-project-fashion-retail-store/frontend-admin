import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import TableCustom from '@/pages/components/TableCustom';
import Overlay from '@/components/ui/overlay';
import useDebounce from '@/hooks/use-debounce';
import Header from '@/pages/components/Header';
import Pagination from '@/pages/components/Pagination';
import Filter from '@/pages/components/Filter';
import type { OrderType } from '@/types';
import SelectCustom from '@/components/SelectCustom';
import useOrderManagementStore from '@/store/orderManagementStore';
import TableRowCustom from '@/pages/OrderManagement/Table/TableRowCustom';
import OrderDetail from '@/pages/OrderManagement/OrderDetail';

type TableColumn<T> = {
	key: keyof T;
	label: string;
	sortable?: boolean;
};

const orderColumns: TableColumn<OrderType>[] = [
	{ key: 'orderNumber', label: 'Order#' },
	{ key: 'user', label: 'Customer' },
	{ key: 'createdAt', label: 'Date', sortable: true },
	{ key: 'totalAmount', label: 'Total Amount', sortable: true },
	{ key: 'paymentDetails', label: 'Payment Status' },
	{ key: 'status', label: 'Order Status' },
	{ key: 'shippingAddress', label: 'Location' },
];

const filterSelectPaymentStatus = [
	{
		title: 'All Payment Status',
		value: 'all',
	},
	{
		title: 'Pending',
		value: 'pending',
	},
	{
		title: 'Paid',
		value: 'paid',
	},
	{
		title: 'Refunded',
		value: 'refunded',
	},
];

const filterSelectOrderStatus = [
	{
		title: 'All Order Status',
		value: 'all',
	},
	{
		title: 'Pending',
		value: 'pending',
	},
	{
		title: 'Processing',
		value: 'processing',
	},
	{
		title: 'Shipped',
		value: 'shipped',
	},
	{
		title: 'Delivered',
		value: 'delivered',
	},
	{
		title: 'Cancelled',
		value: 'cancelled',
	},
];

const OrderManagement = () => {
	const [orders, isGettingOrder, isUpdatingOrder, getOrders, pagination] =
		useOrderManagementStore(
			useShallow((state) => [
				state.orders,
				state.isGettingOrder,
				state.isUpdatingOrder,
				state.getOrders,
				state.pagination,
			])
		);

	const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
	const [paymentStatus, setPaymentStatus] = useState<string>('');
	const [orderStatus, setOrderStatus] = useState<string>('');
	const [searchValue, setSearchValue] = useState('');
	const debounceValue = useDebounce(searchValue, 1000);

	const currentSort = useRef<string>('');

	useEffect(() => {
		const paymentStatusValue = paymentStatus === 'all' ? '' : paymentStatus;
		const orderStatusValue = orderStatus === 'all' ? '' : orderStatus;
		const sort = sortConfig.field
			? (sortConfig.direction === 'desc' ? '-' : '') + sortConfig.field
			: '';

		currentSort.current = sort;
		getOrders(debounceValue, paymentStatusValue, orderStatusValue, sort);
	}, [orderStatus, debounceValue, getOrders, paymentStatus, sortConfig]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isGettingOrder || isUpdatingOrder) return;
		setSearchValue(e.target.value);
	};

	const handleSelectPaymentStatus = (value: string) => {
		if (isGettingOrder || isUpdatingOrder) return;

		setPaymentStatus(value);
	};

	const handleSelectOrderStatus = (value: string) => {
		if (isGettingOrder || isUpdatingOrder) return;

		setOrderStatus(value);
	};

	const handleClickSortField = (field: string) => {
		if (isGettingOrder || isUpdatingOrder) return;

		// Check if field is sortable
		const column = orderColumns.find((col) => col.key === field);
		if (!column?.sortable) return;

		setSortConfig((prev) => {
			if (prev.field !== field) {
				// New field selected
				return { field, direction: 'asc' };
			}

			// Same field - toggle direction
			const direction =
				prev.direction === 'asc'
					? 'desc'
					: prev.direction === 'desc'
					? 'asc'
					: 'asc';
			return { field, direction };
		});
	};

	const handleClickPagination = (paginationLink: string) => {
		if (isGettingOrder || isUpdatingOrder) return;
		getOrders('', '', '', '', paginationLink);
	};

	return (
		<div className='w-full p-4 space-y-10'>
			{/* heading */}
			<Header
				title='Order Management'
				description='Manage orders and their information'
			/>
			<div className='w-full'>
				<div className='w-full space-y-4'>
					{isUpdatingOrder && <Overlay />}
					{/* filter */}
					<Filter
						placeHolderSearch='Search order number, customer name...'
						searchValue={searchValue}
						SelectPaymentStatus={
							<SelectCustom
								className='w-[200px]'
								triggerPlaceHolder='Payment Status'
								items={filterSelectPaymentStatus}
								defaultValue={paymentStatus}
								onValueChange={handleSelectPaymentStatus}
							/>
						}
						SelectOrderStatus={
							<SelectCustom
								className='w-[200px]'
								triggerPlaceHolder='Order Status'
								items={filterSelectOrderStatus}
								defaultValue={orderStatus}
								onValueChange={handleSelectOrderStatus}
							/>
						}
						handleSearch={handleSearch}
					/>
					<TableCustom
						data={orders || []}
						isGettingData={isGettingOrder}
						handleClickSortField={handleClickSortField}
						columns={orderColumns}
						emptyMessage='There is no order'
						renderRow={(order) => (
							<TableRowCustom
								key={order._id}
								data={order}
								dialogTitle='Order Detail'
								dialogDescription='View order details'
								dialogClassName='sm:max-w-[700px] overflow-y-auto scrollbar-hide'
								dialogContent={<OrderDetail />}
							/>
						)}
					/>
					{/* Pagination */}
					{!isGettingOrder && pagination && (
						<Pagination
							page='order(s)'
							pagination={pagination}
							handleClickPagination={handleClickPagination}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrderManagement;
