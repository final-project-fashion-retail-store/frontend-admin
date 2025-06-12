import { Fragment, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Plus, Tag, X } from 'lucide-react';

import SelectFormCustom from '@/components/SelectFormCustom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CardHeaderCustom from '@/pages/ProductManagement/Form/CardHeaderCustom';
import type { ProductFormValues } from '@/pages/ProductManagement/Form/ProductFormContainer';
import { genderOptions, seasonOptions } from '@/constants/ProductForm';

type Props = {
	form: UseFormReturn<ProductFormValues>;
	selectedTags: string[];
	setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
	selectedMaterials: string[];
	setSelectedMaterials: React.Dispatch<React.SetStateAction<string[]>>;
};

const ProductDetail = ({
	form,
	selectedTags,
	setSelectedTags,
	selectedMaterials,
	setSelectedMaterials,
}: Props) => {
	const [newTag, setNewTag] = useState('');
	const [newMaterial, setNewMaterial] = useState('');

	const addTag = () => {
		if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
			setSelectedTags((prev) => [...prev, newTag.trim()]);
			setNewTag('');
		}
	};

	const removeTag = (tagToRemove: string) => {
		setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
	};

	const addMaterial = () => {
		if (newMaterial.trim() && !selectedMaterials.includes(newMaterial.trim())) {
			setSelectedMaterials((prev) => [...prev, newMaterial.trim()]);
			setNewMaterial('');
		}
	};

	const removeMaterial = (materialToRemove: string) => {
		setSelectedMaterials((prev) => prev.filter((m) => m !== materialToRemove));
	};

	return (
		<Fragment>
			<CardHeaderCustom
				Icon={Tag}
				title='Product Specifications'
				iconClassName='size-5 text-orange-600'
			/>
			<CardContent className='space-y-4'>
				{/* gender, season */}
				<div className='w-full flex gap-4 max-md:flex-col'>
					<div className='flex-1'>
						<SelectFormCustom
							className='w-full'
							control={form.control}
							name='gender'
							label='Gender'
							placeholder='Select gender'
							items={genderOptions}
							passToValue='id'
						/>
					</div>
					<div className='flex-1'>
						<SelectFormCustom
							className='w-full'
							control={form.control}
							name='season'
							label='Season'
							placeholder='Select season'
							items={seasonOptions}
							passToValue='id'
						/>
					</div>
				</div>
				{/* tag */}
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label>Tags</Label>
						<div className='flex gap-2'>
							<Input
								type='text'
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
								placeholder='Add tag'
							/>
							<Button
								type='button'
								onClick={addTag}
								variant='outline'
							>
								<Plus className='h-4 w-4' />
							</Button>
						</div>
						<div className='flex flex-wrap gap-2'>
							{selectedTags.map((tag, index) => (
								<Badge
									key={index}
									variant='secondary'
									className='gap-1'
								>
									{tag}
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => removeTag(tag)}
									>
										<X className='size-3' />
									</Button>
								</Badge>
							))}
						</div>
					</div>
				</div>
				{/* material */}
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label>Materials</Label>
						<div className='flex gap-2'>
							<Input
								type='text'
								value={newMaterial}
								onChange={(e) => setNewMaterial(e.target.value)}
								placeholder='Add material (e.g., Cotton, Polyester)'
							/>
							<Button
								type='button'
								onClick={addMaterial}
								variant='outline'
							>
								<Plus className='h-4 w-4' />
							</Button>
						</div>
						<div className='flex flex-wrap gap-2'>
							{selectedMaterials.map((material, index) => (
								<Badge
									key={index}
									variant='secondary'
									className='gap-1'
								>
									{material}
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => removeMaterial(material)}
									>
										<X className='size-3' />
									</Button>
								</Badge>
							))}
						</div>
					</div>
				</div>
				{/* care instructions */}
				<FormField
					control={form.control}
					name='careInstructions'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Care Instructions</FormLabel>
							<FormControl>
								<Textarea
									placeholder='e.g., Machine wash cold, tumble dry low, do not bleach'
									rows={2}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Fragment>
	);
};

export default ProductDetail;
