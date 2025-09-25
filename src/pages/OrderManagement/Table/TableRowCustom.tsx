import type { OrderType } from '@/types';
import React, { Fragment } from 'react';

import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useShallow } from 'zustand/react/shallow';
import useOrderManagementStore from '@/store/orderManagementStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Eye, MapPin } from 'lucide-react';
import DialogCustom from '@/components/DialogCustom';
import { toast } from 'sonner';

const paymentStatusColors = {
	paid: 'bg-green-100 text-green-800',
	pending: 'bg-yellow-100 text-yellow-800',
	failed: 'bg-red-100 text-red-800',
	refunded: 'bg-gray-100 text-gray-800',
};

const orderStatusOptions = [
	'pending',
	'processing',
	'shipped',
	'delivered',
	'cancelled',
];

type Props = {
	data: OrderType;
	dialogClassName?: string;
	dialogTitle: string;
	dialogDescription: string;
	dialogContent: React.ReactNode;
};

const TableRowCustom = ({
	data,
	dialogClassName,
	dialogTitle,
	dialogDescription,
	dialogContent,
}: Props) => {
	const [updateOrder, setSelectedOrder] = useOrderManagementStore(
		useShallow((state) => [state.updateOrder, state.setSelectedOrder])
	);

	const handleChangeStatus = async (orderId: string, status: string) => {
		const result = await updateOrder(orderId, status);

		if (result.success) {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	};

	return (
		<Fragment>
			<TableRow>
				<TableCell className='font-medium'>{data.orderNumber}</TableCell>
				<TableCell>
					<div className='flex flex-row items-center justify-start space-x-2'>
						<Avatar>
							<AvatarImage
								src={data.user.avatar.url}
								alt='Avatar'
							/>
							<AvatarFallback>FB</AvatarFallback>
						</Avatar>
						<div className='flex flex-col'>
							<span>{data.user.fullName}</span>
							<span>{data.user.email}</span>
							<span>{data.user.phoneNumber}</span>
						</div>
					</div>
				</TableCell>
				<TableCell className='text-start'>
					{new Date(data.createdAt).toLocaleDateString(undefined, {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
					})}
				</TableCell>
				<TableCell className='text-start'>
					{data.totalAmount.toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
					})}
				</TableCell>
				<TableCell className='text-center'>
					<Badge
						className={
							paymentStatusColors[
								data.paymentDetails.status as keyof typeof paymentStatusColors
							]
						}
					>
						{data.paymentDetails.status}
					</Badge>
				</TableCell>
				<TableCell>
					<Select
						value={data.status}
						onValueChange={(value) => handleChangeStatus(data._id, value)}
					>
						<SelectTrigger className='w-34 h-8'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{orderStatusOptions.map((status) => (
								<SelectItem
									key={status}
									value={status}
								>
									{status}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</TableCell>
				<TableCell>
					<div className='flex items-start gap-1'>
						<MapPin className='w-3 h-3 mt-0.5 flex-shrink-0' />
						<div className='text-sm'>
							<div className='font-medium'>{data?.shippingAddress?.fullName}</div>
							<div className='text-muted-foreground/80 truncate'>
								{data?.shippingAddress?.formattedAddress}
							</div>
							<div className='text-muted-foreground/60 text-xs'>
								{data?.shippingAddress?.phoneNumber}
							</div>
						</div>
					</div>
				</TableCell>
				<TableCell className='text-center'>
					<DialogCustom
						className={dialogClassName}
						title={dialogTitle}
						description={dialogDescription}
						form={dialogContent}
					>
						<Eye
							className='text-muted-foreground cursor-pointer'
							onClick={() => setSelectedOrder(data)}
						/>
					</DialogCustom>
				</TableCell>
			</TableRow>
		</Fragment>
	);
};

export default TableRowCustom;
