import { Fragment, useRef } from 'react';
import { Plus, Upload, X } from 'lucide-react';

import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGeneralStore } from '@/store';
import CardHeaderCustom from '@/pages/ProductManagement/Form/CardHeaderCustom';

type Props = {
	productImages: { public_id: string; secure_url: string }[];
	handleDestroyImages: (publicId: string, imgOf: string, color?: string) => void;
	setUploadImageFor: React.Dispatch<
		React.SetStateAction<'' | 'color' | 'product'>
	>;
};

const ProductImages = ({
	productImages,
	handleDestroyImages,
	setUploadImageFor,
}: Props) => {
	const uploadImages = useGeneralStore((state) => state.uploadImages);
	const uploadProductImagesRef = useRef<HTMLInputElement>(null);

	const handleUploadProductImages = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target?.files;
		if (!files || files.length === 0) return;
		const fileArray = Array.from(files);
		const formData = new FormData();
		fileArray.forEach((file) => {
			formData.append('images', file);
		});

		setUploadImageFor('product');
		uploadImages(formData);
	};

	return (
		<Fragment>
			<CardHeaderCustom
				title='Product Images'
				Icon={Upload}
				iconClassName='size-5 text-purple-600'
			/>
			<CardContent>
				<Input
					ref={uploadProductImagesRef}
					type='file'
					accept='image/*'
					multiple
					hidden
					onChange={(e) => handleUploadProductImages(e)}
				/>
				{productImages && productImages.length > 0 ? (
					<div className='space-y-4'>
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
							{productImages.map((img) => (
								<div
									key={img.public_id}
									className='relative group'
								>
									<div className='aspect-square rounded-lg overflow-hidden border'>
										<img
											src={img.secure_url}
											alt={'Product image'}
											width={200}
											height={200}
											className='w-full h-full object-cover'
										/>
									</div>
									<Button
										asChild
										variant='destructive'
										size='icon'
										className='absolute top-2 right-2 size-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
										onClick={() => handleDestroyImages(img.public_id, 'product')}
									>
										<X className='size-3' />
									</Button>
								</div>
							))}

							<div
								className='aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-accent'
								onClick={() => uploadProductImagesRef.current?.click()}
							>
								<Plus className='h-8 w-8 text-muted-foreground' />
								<span className='text-sm text-muted-foreground mt-1'>Add More</span>
							</div>
						</div>
					</div>
				) : (
					<div
						className='border-2 border-input border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent transition-colors duration-150 ease-in-out'
						onClick={() => uploadProductImagesRef.current?.click()}
					>
						<Upload className='size-12 text-muted-foreground mx-auto mb-4' />
						<p className='text-muted-foreground mb-2'>
							Drag and drop images here, or click to browse
						</p>
						<p className='text-sm text-muted-foreground'>Max 5MB each</p>
					</div>
				)}
			</CardContent>
		</Fragment>
	);
};

export default ProductImages;
