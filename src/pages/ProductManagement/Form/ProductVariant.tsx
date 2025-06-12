import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CardHeaderCustom from '@/pages/ProductManagement/Form/CardHeaderCustom';
import { Palette, Plus, Upload, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import {
	colorOptions,
	clothingSizeOptions,
	footwearSizeOptions,
} from '@/constants/ProductForm';
import type { VariantSendType } from '@/types';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormValues } from '@/pages/ProductManagement/Form/ProductFormContainer';
import { useGeneralStore, useProductManagementStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { useParams } from 'react-router-dom';

type Props = {
	form: UseFormReturn<ProductFormValues>;
	selectedCategory: string;
	variants: VariantSendType[];
	setVariants: React.Dispatch<React.SetStateAction<VariantSendType[]>>;
	colorImages: { [color: string]: { public_id: string; secure_url: string }[] };
	setUploadImageFor: React.Dispatch<
		React.SetStateAction<'' | 'product' | 'color'>
	>;
	setCurrentColorImage: React.Dispatch<React.SetStateAction<string>>;
	handleDestroyImages: (publicId: string, imgOf: string, color?: string) => void;
};

const ProductVariant = ({
	form,
	selectedCategory,
	variants,
	setVariants,
	colorImages,
	setUploadImageFor,
	setCurrentColorImage,
	handleDestroyImages,
}: Props) => {
	const [isUploadingImages, uploadImages] = useGeneralStore(
		useShallow((state) => [state.isUploadingImages, state.uploadImages])
	);
	const selectedProduct = useProductManagementStore(
		(state) => state.selectedProduct
	);
	const [selectedColors, setSelectedColors] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

	const { slug } = useParams();

	useEffect(() => {
		if (selectedProduct && slug) {
			setSelectedColors(Object.keys(selectedProduct.colorImages || {}));
			setSelectedSizes([
				...new Set((selectedProduct.variants || []).map((v) => v.size)),
			]);
		}
	}, [selectedProduct, slug]);

	const getSizeOptions = () => {
		return ['Sneakers', 'Sandals'].includes(selectedCategory)
			? footwearSizeOptions
			: clothingSizeOptions;
	};

	const generateVariants = () => {
		if (selectedColors.length === 0 || selectedSizes.length === 0) return;

		// Get current form values
		const formValues = form.getValues();
		const productName = formValues.name || 'PROD';
		const productPrice = formValues.price;
		const productSalePrice = formValues.salePrice;

		const newVariants: VariantSendType[] = [];

		selectedColors.forEach((color) => {
			selectedSizes.forEach((size) => {
				const variantSku = `${productName
					.split(' ') //split words
					.map((n) => n.substring(0, 1).toUpperCase()) //take first letter of each word
					.join('')}-${color.substring(0, 3).toUpperCase()}-${size}`;

				// Check if variant already exists
				const existingVariant = variants.find(
					(v) => v.color?.toLowerCase() === color.toLowerCase() && v.size === size
				);

				if (!existingVariant) {
					newVariants.push({
						sku: variantSku,
						color,
						size,
						price: productPrice,
						salePrice: productSalePrice,
						inventory: 0,
						reservedInventory: 0,
					});
				}
			});
		});
		setVariants((prev) => [...prev, ...newVariants]);
	};

	const removeVariant = (sku: string) => {
		setVariants((prev) => prev.filter((variant) => variant.sku !== sku));
	};

	const updateVariant = (
		index: number,
		field: keyof VariantSendType,
		value: unknown
	) => {
		setVariants((prev) =>
			prev.map((variant, i) =>
				i === index ? { ...variant, [field]: value } : variant
			)
		);
	};

	const handleUploadColorImages = (
		e: React.ChangeEvent<HTMLInputElement>,
		color: string
	) => {
		const files = e.target?.files;
		if (!files || files.length === 0) return;
		const fileArray = Array.from(files);
		const formData = new FormData();
		fileArray.forEach((file) => {
			formData.append('images', file);
		});

		setUploadImageFor('color');
		setCurrentColorImage(color);
		uploadImages(formData);
	};

	return (
		<Fragment>
			<CardHeaderCustom
				Icon={Palette}
				title='Product Variants'
				iconClassName='size-5 text-indigo-600'
			/>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='space-y-4'>
						<Label>Available Colors</Label>
						<div className='grid grid-cols-3 gap-2'>
							{colorOptions.map((color) => (
								<div
									key={color}
									className='flex items-center space-x-2'
								>
									<input
										type='checkbox'
										id={`color-${color}`}
										checked={selectedColors.includes(color)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedColors((prev) => [...prev, color]);
											} else {
												setSelectedColors((prev) => prev.filter((c) => c !== color));
											}
										}}
										className='rounded'
									/>
									<Label
										htmlFor={`color-${color}`}
										className='text-sm'
									>
										{color}
									</Label>
								</div>
							))}
						</div>
					</div>

					<div className='space-y-4'>
						<Label>Available Sizes</Label>
						<div className='grid grid-cols-3 gap-2'>
							{getSizeOptions().map((size) => (
								<div
									key={size}
									className='flex items-center space-x-2'
								>
									<input
										type='checkbox'
										id={`size-${size}`}
										checked={selectedSizes.includes(size)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedSizes((prev) => [...prev, size]);
											} else {
												setSelectedSizes((prev) => prev.filter((s) => s !== size));
											}
										}}
										className='rounded'
									/>
									<Label
										htmlFor={`size-${size}`}
										className='text-sm'
									>
										{size}
									</Label>
								</div>
							))}
						</div>
					</div>
				</div>
				{selectedColors.length > 0 && selectedSizes.length > 0 && (
					<Button
						type='button'
						onClick={generateVariants}
						className='gap-2'
					>
						<Palette className='h-4 w-4' />
						Generate Variants ({selectedColors.length} × {selectedSizes.length} ={' '}
						{selectedColors.length * selectedSizes.length})
					</Button>
				)}
				{variants.length > 0 && (
					<div className='space-y-4'>
						<h4 className='font-medium'>Variants ({variants.length})</h4>
						{variants.map((variant, index) => (
							<div
								key={index}
								className='border rounded-lg p-4 space-y-4'
							>
								<div className='flex items-center justify-between'>
									<div className='flex gap-2'>
										<Badge variant='outline'>Color: {variant.color}</Badge>
										<Badge variant='outline'>Size: {variant.size}</Badge>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => removeVariant(variant.sku || '')}
										className='text-red-600 hover:text-red-700'
									>
										<X className='h-4 w-4' />
									</Button>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
									<div className='space-y-2'>
										<Label>SKU</Label>
										<Input
											value={variant.sku}
											onChange={(e) => updateVariant(index, 'sku', e.target.value)}
											placeholder='Variant SKU'
										/>
									</div>
									<div className='space-y-2'>
										<Label>Price</Label>
										<Input
											type='number'
											step='0.01'
											value={variant.price}
											onChange={(e) =>
												updateVariant(
													index,
													'price',
													Number.parseFloat(e.target.value) || 0
												)
											}
											placeholder='0.00'
										/>
									</div>
									<div className='space-y-2'>
										<Label>Sale Price</Label>
										<Input
											type='number'
											step='0.01'
											value={variant.salePrice || ''}
											onChange={(e) =>
												updateVariant(index, 'salePrice', Number.parseFloat(e.target.value))
											}
											placeholder='0.00'
										/>
									</div>
									<div className='space-y-2'>
										<Label>Inventory</Label>
										<Input
											type='number'
											value={variant.inventory}
											onChange={(e) =>
												updateVariant(index, 'inventory', Number.parseInt(e.target.value))
											}
											placeholder='0'
										/>
									</div>
									<div className='space-y-2'>
										<Label>Reserved</Label>
										<Input
											type='number'
											value={variant.reservedInventory}
											onChange={(e) =>
												updateVariant(
													index,
													'reservedInventory',
													Number.parseInt(e.target.value)
												)
											}
											placeholder='0'
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
				{selectedColors.length > 0 && (
					<div className='space-y-4 mt-6'>
						<h4 className='font-medium'>Color Images</h4>
						<p className='text-sm text-gray-600'>
							Upload specific images for each color variant
						</p>
						{selectedColors.map((color) => (
							<div
								key={color}
								className='border rounded-lg p-4 space-y-4'
							>
								<div className='flex items-center justify-between'>
									<div className='flex gap-2'>
										<Badge variant='outline'>Color: {color}</Badge>
										<Badge
											variant='secondary'
											className='text-xs'
										>
											{colorImages?.[color]?.length || 0} images
										</Badge>
									</div>
									<Button
										type='button'
										className='text-red-600 hover:text-red-700'
										variant='ghost'
										size='sm'
										onClick={() =>
											setSelectedColors((prev) => prev.filter((c) => c !== color))
										}
									>
										<X className='size-4' />
									</Button>
								</div>

								<div className='space-y-2'>
									<Label>Images for {color}</Label>
									<input
										id={`color-images-${color}`}
										type='file'
										className='hidden'
										accept='image/*'
										multiple
										onChange={(e) => handleUploadColorImages(e, color)}
										disabled={isUploadingImages}
									/>

									{colorImages?.[color]?.length > 0 ? (
										<div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
											{colorImages[color].map((img, index) => (
												<div
													key={index}
													className='relative group'
												>
													<div className='aspect-square rounded-lg overflow-hidden border border-gray-200'>
														<img
															src={img.secure_url}
															alt={`${color} image ${index + 1}`}
															className='size-[80px] w-full h-full object-cover'
														/>
													</div>
													<Button
														type='button'
														variant='destructive'
														size='icon'
														className='absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity'
														onClick={() => handleDestroyImages(img.public_id, 'color', color)}
													>
														<X className='h-3 w-3' />
													</Button>
												</div>
											))}

											<div
												className='aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50'
												onClick={() =>
													document.getElementById(`color-images-${color}`)?.click()
												}
											>
												<Plus className='h-4 w-4 text-gray-400' />
												<span className='text-xs text-gray-500 mt-1'>Add</span>
											</div>
										</div>
									) : (
										<div
											className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50'
											onClick={() =>
												document.getElementById(`color-images-${color}`)?.click()
											}
										>
											<Upload className='h-6 w-6 text-gray-400 mx-auto mb-2' />
											<p className='text-xs text-gray-600'>Add images for {color}</p>
											<p className='text-xs text-gray-500'>
												All variants with this color will use these images
											</p>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Fragment>
	);
};

export default ProductVariant;
