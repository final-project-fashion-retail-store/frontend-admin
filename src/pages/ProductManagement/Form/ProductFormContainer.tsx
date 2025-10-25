import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { useGeneralStore, useProductManagementStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import Overlay from '@/components/ui/overlay';
import type { VariantSendType } from '@/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import ProductFormHeader from '@/pages/ProductManagement/Form/ProductFormHeader';
import BasicInformation from '@/pages/ProductManagement/Form/BasicInformation';
import Pricing from '@/pages/ProductManagement/Form/Pricing';
import Description from '@/pages/ProductManagement/Form/Description';
import ProductImages from '@/pages/ProductManagement/Form/ProductImages';
import ProductDetail from '@/pages/ProductManagement/Form/ProductDetail';
import ProductVariant from '@/pages/ProductManagement/Form/ProductVariant';
import SEOSetting from '@/pages/ProductManagement/Form/SEOSetting';
import ProductSetting from '@/pages/ProductManagement/Form/ProductSetting';

const initialFormValues = {
	name: '',
	brand: '',
	category: '',
	importPrice: 0,
	price: 0,
	salePrice: 0,
	shortDescription: '',
	description: '',
	metaTitle: '',
	metaDescription: '',
	inStock: true,
	featuredProduct: false,
	gender: 'Men' as 'Men' | 'Women' | undefined,
	season: 'All Season' as
		| 'Spring'
		| 'Summer'
		| 'Fall'
		| 'Winter'
		| 'All Season'
		| undefined,
	careInstructions: '',
};

const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Product name is required',
	}),
	brand: z.string().min(1, {
		message: 'Brand is required',
	}),
	category: z.string().min(1, {
		message: 'Category is required',
	}),
	importPrice: z.coerce.number().min(0, {
		message: 'Import price must be a positive number',
	}),
	price: z.coerce.number().min(0, {
		message: 'Price must be a positive number',
	}),
	salePrice: z.coerce
		.number()
		.min(0, {
			message: 'Sale price must be a positive number',
		})
		.optional(),
	shortDescription: z.string().optional(),
	description: z.string().optional(),
	metaTitle: z
		.string()
		.max(60, {
			message: 'SEO title must be at most 60 characters',
		})
		.optional(),
	metaDescription: z
		.string()
		.max(160, {
			message: 'SEO description must be at most 160 characters',
		})
		.optional(),
	inStock: z.boolean().optional(),
	featuredProduct: z.boolean().optional(),
	gender: z.enum(['Men', 'Women'], { message: 'Invalid gender' }).optional(),
	season: z
		.enum(['Spring', 'Summer', 'Fall', 'Winter', 'All Season'], {
			message: 'Invalid season',
		})
		.optional(),
	careInstructions: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof formSchema>;

type Props = {
	title: string;
	description: string;
	buttonTitle: string;
};

const ProductForm = ({ title, description, buttonTitle }: Props) => {
	const navigate = useNavigate();
	const [
		brands,
		subcategories,
		getBrands,
		getSubcategories,
		isGettingProduct,
		isCreatingProduct,
		isUpdatingProduct,
		createProduct,
		updateProduct,
		selectedProduct,
		getProducts,
		getProduct,
		resetProductStates,
	] = useProductManagementStore(
		useShallow((state) => [
			state.brands,
			state.subcategories,
			state.getBrands,
			state.getSubcategories,
			state.isGettingProduct,
			state.isCreatingProduct,
			state.isUpdatingProduct,
			state.createProduct,
			state.updateProduct,
			state.selectedProduct,
			state.getProducts,
			state.getProduct,
			state.resetProductStates,
		])
	);

	const [
		isUploadingImages,
		isDestroyingImages,
		uploadedImages,
		destroyImages,
		resetStates,
	] = useGeneralStore(
		useShallow((state) => [
			state.isUploadingImages,
			state.isDestroyingImages,
			state.uploadedImages,
			state.destroyImages,
			state.resetStates,
		])
	);

	const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
	const [productImages, setProductImages] = useState<
		{ public_id: string; secure_url: string }[]
	>([]);
	const [colorImages, setColorImages] = useState<{
		[color: string]: { public_id: string; secure_url: string }[];
	}>({});
	const [uploadImageFor, setUploadImageFor] = useState<'product' | 'color' | ''>(
		''
	);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
	const [variants, setVariants] = useState<VariantSendType[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [currentColorImage, setCurrentColorImage] = useState<string>('');

	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const brandItemsRef = useRef<{ id: string; name: string }[]>([]);
	const categoryItemsRef = useRef<{ id: string; name: string }[]>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialFormValues,
	});

	const { slug } = useParams();

	useEffect(() => {
		if (slug) {
			getProduct(slug);
		} else {
			// Reset form and all related local states for a new product
			form.reset(initialFormValues);
			setProductImages([]);
			setColorImages({});
			setSelectedTags([]);
			setSelectedMaterials([]);
			setVariants([]);
			setSelectedCategory('');
			resetProductStates();
		}

		return () => {
			resetStates();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug, getProduct, resetStates, form /*, clearSelectedProduct */]);

	useEffect(() => {
		if (selectedProduct && slug) {
			// Wait for brands and categories to be loaded before populating form
			if (
				brandItemsRef.current.length === 0 ||
				categoryItemsRef.current.length === 0
			) {
				return;
			}
			// Only run if there's a product and we are in edit mode (slug exists)
			form.reset({
				name: selectedProduct.name,
				brand: selectedProduct.brand._id,
				category: selectedProduct.category._id,
				importPrice: selectedProduct.importPrice || 0,
				price: selectedProduct.price,
				salePrice: selectedProduct.salePrice || 0,
				shortDescription: selectedProduct.shortDescription || '',
				description: selectedProduct.description || '',
				metaTitle: selectedProduct.metaTitle || '',
				metaDescription: selectedProduct.metaDescription || '',
				inStock: selectedProduct.inStock ?? true,
				featuredProduct: selectedProduct.featuredProduct ?? false,
				gender: selectedProduct.gender as 'Men' | 'Women' | undefined,
				season: selectedProduct.season as
					| 'Spring'
					| 'Summer'
					| 'Fall'
					| 'Winter'
					| 'All Season'
					| undefined,
				careInstructions: selectedProduct.careInstructions || '',
			});

			setProductImages(
				selectedProduct.images.map((img) => ({
					public_id: img.public_id,
					secure_url: img.url,
				}))
			);
			setColorImages(
				Object.fromEntries(
					Object.entries(selectedProduct.colorImages || {}).map(([color, imgs]) => [
						color,
						(imgs || []).map((img) => ({
							public_id: img.public_id,
							secure_url: img.url,
						})),
					])
				)
			);
			setSelectedTags(selectedProduct.tags || []);
			setSelectedMaterials(selectedProduct.material || []);
			setVariants(selectedProduct.variants || []);

			if (selectedProduct.category?._id && categoryItemsRef.current.length > 0) {
				const category = categoryItemsRef.current.find(
					(cat) => cat.id === selectedProduct.category._id
				);
				setSelectedCategory(category ? category.name : '');
			} else if (selectedProduct.category?.name) {
				setSelectedCategory(selectedProduct.category.name);
			} else {
				setSelectedCategory('');
			}
		}
	}, [selectedProduct, slug, form]);

	useEffect(() => {
		getBrands('', '', '', '', '', 1000, false);
		getSubcategories('', '', '', '', 1000, false);
	}, [getBrands, getSubcategories]);

	useEffect(() => {
		// Convert brands and categories to the format required by SelectFormCustom
		if (brands && brands.length > 0) {
			brandItemsRef.current = brands.map((brand) => ({
				id: brand._id,
				name: brand.name,
			}));
		}

		if (subcategories && subcategories.length > 0) {
			categoryItemsRef.current = subcategories.map((category) => ({
				id: category._id,
				name: category.name,
			}));
		}
	}, [brands, subcategories]);

	// Fix render brand and category in edit form
	useEffect(() => {
		let timerId: NodeJS.Timeout;
		if (
			selectedProduct &&
			slug &&
			brands &&
			brands.length > 0 &&
			subcategories &&
			subcategories.length > 0
		) {
			timerId = setTimeout(() => {
				form.reset({
					name: selectedProduct.name,
					brand: selectedProduct.brand._id,
					category: selectedProduct.category._id,
					importPrice: selectedProduct.importPrice || 0,
					price: selectedProduct.price,
					salePrice: selectedProduct.salePrice || 0,
					shortDescription: selectedProduct.shortDescription || '',
					description: selectedProduct.description || '',
					metaTitle: selectedProduct.metaTitle || '',
					metaDescription: selectedProduct.metaDescription || '',
					inStock: selectedProduct.inStock ?? true,
					featuredProduct: selectedProduct.featuredProduct ?? false,
					gender: selectedProduct.gender as 'Men' | 'Women' | undefined,
					season: selectedProduct.season as
						| 'Spring'
						| 'Summer'
						| 'Fall'
						| 'Winter'
						| 'All Season'
						| undefined,
					careInstructions: selectedProduct.careInstructions || '',
				});
			}, 1000);
		}

		return () => {
			if (timerId) {
				clearTimeout(timerId);
			}
		};
	}, [brands, form, selectedProduct, slug, subcategories]);

	useEffect(() => {
		if (!uploadedImages || uploadedImages.length === 0) return;

		if (uploadImageFor === 'product') {
			// Set product images from uploaded images
			setProductImages((prev) => [...prev, ...uploadedImages]);
			resetStates();
		}

		if (uploadImageFor === 'color') {
			// Set color images for the specific color
			setColorImages((prev) => ({
				...prev,
				[currentColorImage]: [
					...(prev[currentColorImage] || []),
					...uploadedImages,
				],
			}));
			console.log('Color images updated:', currentColorImage);
			resetStates();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uploadImageFor, uploadedImages]);

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isCreatingProduct || isUpdatingProduct) return;

		const fullData = {
			...values,
			images: productImages.map((img) => ({
				public_id: img.public_id,
				url: img.secure_url,
			})),
			colorImages: Object.fromEntries(
				Object.entries(colorImages).map(([color, imgs]) => [
					color,
					imgs.map((img) => ({
						public_id: img.public_id,
						url: img.secure_url,
					})),
				])
			),
			tags: selectedTags,
			material: selectedMaterials,
			variants: variants,
		};

		let errMessage;
		if (selectedProduct) {
			// If a product is selected, update it
			errMessage = await updateProduct(selectedProduct._id, fullData);
		} else {
			// Otherwise, create a new product
			errMessage = await createProduct(fullData);
		}

		if (errMessage) {
			form.setError('root', {
				type: 'custom',
				message: errMessage,
			});
			return;
		}
		setIsSubmitSuccess(true);
		await getProducts();
		setTimeout(() => {
			handleGoBack();
		}, 1500);
	}

	const handleGoBack = () => {
		navigate(-1); // Navigate to the previous page
	};

	const handleDestroyImages = async (
		publicId: string,
		imgOf: string,
		color?: string
	) => {
		const result = await destroyImages({ publicId: [publicId] });
		if (!result) return;
		if (imgOf === 'product') {
			setProductImages((prev) => prev.filter((img) => img.public_id !== publicId));
		} else if (imgOf === 'color' && color) {
			setColorImages((prev) => {
				const updatedColorImages = { ...prev };
				if (updatedColorImages[color]) {
					updatedColorImages[color] = updatedColorImages[color].filter(
						(img) => img.public_id !== publicId
					);
					if (updatedColorImages[color].length === 0) {
						delete updatedColorImages[color];
					}
				}
				return updatedColorImages;
			});
		}
	};

	const handleChangeCategory = (_: unknown, __: unknown, title?: string) => {
		setSelectedCategory(title || '');
	};

	if (isGettingProduct && !isSubmitSuccess) {
		return (
			<div className='w-full h-screen flex items-center justify-center'>
				<HugeiconsIcon
					icon={Orbit01Icon}
					className='animate-spin'
				/>
			</div>
		);
	}

	return (
		<div className='w-full py-4 px-1 xl:p-4 space-y-10'>
			{(isUploadingImages ||
				isDestroyingImages ||
				isCreatingProduct ||
				isUpdatingProduct) && <Overlay />}
			{/* Heading */}
			<ProductFormHeader
				title={title}
				description={description}
				buttonTitle={buttonTitle}
				submitBtnRef={submitBtnRef}
				handleGoBack={handleGoBack}
			/>
			{/* Contents */}
			<div className='w-full xl:px-60'>
				<Form {...form}>
					{form.formState.errors.root?.message && (
						<div className='mb-4'>
							<FormMessage>{form.formState.errors.root.message}</FormMessage>
						</div>
					)}
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card className='w-full'>
							{/* Basic information */}
							<BasicInformation
								form={form}
								brandItems={brandItemsRef.current}
								categoryItems={categoryItemsRef.current}
								handleChangeCategory={handleChangeCategory}
							/>
							{/* Pricing */}
							<Pricing form={form} />
							{/* Description */}
							<Description form={form} />
							{/* Product images */}
							<ProductImages
								productImages={productImages}
								handleDestroyImages={handleDestroyImages}
								setUploadImageFor={setUploadImageFor}
							/>
							{/* Product Detail */}
							<ProductDetail
								form={form}
								selectedTags={selectedTags}
								setSelectedTags={setSelectedTags}
								selectedMaterials={selectedMaterials}
								setSelectedMaterials={setSelectedMaterials}
							/>
							{/* Product variants */}
							<ProductVariant
								form={form}
								selectedCategory={selectedCategory}
								variants={variants}
								setVariants={setVariants}
								colorImages={colorImages}
								setUploadImageFor={setUploadImageFor}
								setCurrentColorImage={setCurrentColorImage}
								handleDestroyImages={handleDestroyImages}
							/>
							{/* SEO settings */}
							<SEOSetting form={form} />
							{/* Product settings */}
							<ProductSetting form={form} />
						</Card>
						<Button
							ref={submitBtnRef}
							type='submit'
							hidden
						/>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ProductForm;
