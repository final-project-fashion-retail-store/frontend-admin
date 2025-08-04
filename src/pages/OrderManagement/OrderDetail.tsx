import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useOrderManagementStore from '@/store/orderManagementStore';
import type { VariantType } from '@/types';
import { MapPin, Package } from 'lucide-react';

const getVariantDetails = (variants: VariantType[], variantId: string) => {
	const variant = variants.find((v) => v._id === variantId);
	return {
		size: variant?.size,
		color: variant?.color,
		sku: variant?.sku,
	};
};

const OrderDetail = () => {
	const selectedOrder = useOrderManagementStore((state) => state.selectedOrder);
	if (!selectedOrder) {
		return null;
	}
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Package className='w-5 h-5' />
						Order Items
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{selectedOrder.items.map((item) => {
							const { size, color, sku } = getVariantDetails(
								item.product.variants,
								item.variantId
							);
							return (
								<div
									key={item.variantId}
									className='flex items-start gap-4 p-4 border rounded-lg'
								>
									<img
										src={item.image}
										alt={item.name}
										width={60}
										height={60}
										className='rounded-lg object-cover'
									/>
									<div className='flex-1'>
										<h4 className='font-medium'>{item.name}</h4>
										<div className='flex gap-4 mt-1'>
											<div className='flex items-center gap-2'>
												<span className='text-xs bg-muted-foreground/20 px-2 py-1 rounded'>
													Size: {size}
												</span>
												<span className='text-xs bg-muted-foreground/20 px-2 py-1 rounded'>
													Color: {color}
												</span>
											</div>
										</div>
										<p className='text-sm text-muted-foreground mt-1'>SKU: {sku}</p>
										<div className='flex items-center gap-4 mt-2'>
											<p className='text-sm text-muted-foreground'>
												Quantity: {item.quantity}
											</p>
											<p className='text-sm text-muted-foreground'>
												${item.price.toFixed(2)} each
											</p>
										</div>
									</div>
									<div className='text-right'>
										<p className='font-medium'>
											${(item.price * item.quantity).toFixed(2)}
										</p>
									</div>
								</div>
							);
						})}
					</div>

					<Separator className='my-4' />

					<div className='space-y-2'>
						<div className='flex justify-between'>
							<span>Subtotal:</span>
							<span>${selectedOrder.subtotal}</span>
						</div>
						<div className='flex justify-between'>
							<span>Shipping:</span>
							<span>
								{selectedOrder.shippingCost === 0
									? 'FREE'
									: `$${selectedOrder.shippingCost}`}
							</span>
						</div>
						<div className='flex justify-between'>
							<span>Tax:</span>
							<span>${selectedOrder.taxAmount}</span>
						</div>
						<Separator />
						<div className='flex justify-between font-bold text-lg'>
							<span>Total:</span>
							<span>${selectedOrder.totalAmount}</span>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className='mt-6'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<MapPin className='w-5 h-5' />
						Shipping Address
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{/* Recipient Info */}
						<div className='flex items-center justify-between p-3 bg-muted-foreground/10 rounded-lg'>
							<div>
								<h4 className='font-medium text-foreground'>
									{selectedOrder.shippingAddress.fullName}
								</h4>
								<p className='text-sm text-muted-foreground'>
									{selectedOrder.shippingAddress.phoneNumber}
								</p>
							</div>
							<div className='flex gap-2'>
								<Badge
									variant='outline'
									className='text-xs'
								>
									{selectedOrder.shippingAddress.label}
								</Badge>
							</div>
						</div>

						{/* Detailed Address */}
						<div className='space-y-2'>
							<div>
								<label className='text-sm font-medium text-muted-foreground'>
									Street Address
								</label>
								<p className='text-sm'>{selectedOrder.shippingAddress.addressLine}</p>
							</div>

							<div className='grid grid-cols-3 gap-4'>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>
										Ward
									</label>
									<p className='text-sm'>{selectedOrder.shippingAddress.ward}</p>
								</div>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>
										District
									</label>
									<p className='text-sm'>{selectedOrder.shippingAddress.district}</p>
								</div>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>
										City
									</label>
									<p className='text-sm'>{selectedOrder.shippingAddress.city}</p>
								</div>
							</div>

							<div className='pt-2 border-t'>
								<label className='text-sm font-medium text-muted-foreground'>
									Full Address
								</label>
								<p className='text-sm font-medium'>
									{selectedOrder.shippingAddress.formattedAddress}
								</p>
							</div>
						</div>

						{/* Quick Actions */}
						{/* <div className='flex gap-2 pt-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() =>
									window.open(`tel:${selectedOrder.shippingAddress.phoneNumber}`)
								}
							>
								Call Customer
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() =>
									window.open(
										`https://maps.google.com/?q=${encodeURIComponent(
											selectedOrder.shippingAddress.formattedAddress
										)}`
									)
								}
							>
								View on Map
							</Button>
						</div> */}
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default OrderDetail;
