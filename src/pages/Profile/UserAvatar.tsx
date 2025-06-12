import { Camera02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import { useGeneralStore } from '@/store';
import { useEffect } from 'react';

const UserAvatar = () => {
	const [authUser, updateProfile, isUpdatingProfile] = useAuthStore(
		useShallow((state) => [
			state.authUser,
			state.updateProfile,
			state.isUpdatingProfile,
		])
	);
	const [
		isUploadingImages,
		uploadImages,
		isDestroyingImages,
		destroyImages,
		uploadedImages,
	] = useGeneralStore(
		useShallow((state) => [
			state.isUploadingImages,
			state.uploadImages,
			state.isDestroyingImages,
			state.destroyImages,
			state.uploadedImages,
		])
	);

	useEffect(() => {
		if (uploadedImages && uploadedImages.length > 0) {
			const newAvatarData = {
				url: uploadedImages[0].secure_url,
				public_id: uploadedImages[0].public_id,
			};

			updateProfile({ avatar: newAvatarData });
		}
	}, [uploadedImages, updateProfile]);

	const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file');
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error('File size exceeds 5MB');
			return;
		}

		const formData = new FormData();
		formData.append('images', file);

		// Destroy previous image first
		if (authUser?.avatar?.public_id) {
			await destroyImages({ publicId: [authUser?.avatar?.public_id || ''] });
		}
		// Then upload new image
		await uploadImages(formData);
	};

	return (
		<label htmlFor='avatar'>
			<div className='size-20 max-md:size-14 cursor-pointer relative group p-1 max-md:p-0'>
				<Avatar
					className={`size-full ring ring-foreground ${
						(isUpdatingProfile || isUploadingImages || isDestroyingImages) &&
						'animate-pulse'
					}`}
				>
					<AvatarImage
						src={authUser?.avatar.url}
						alt='Avatar'
						className='object-cover'
					/>
					<AvatarFallback>FB</AvatarFallback>
				</Avatar>
				{/* camera icon */}
				<span className='flex items-center justify-center bg-secondary ring-1 ring-foreground/50 rounded-full size-8 max-md:size-6 absolute -bottom-2 right-0 transition-opacity ease-linear duration-150 2xl:opacity-0 opacity-100 group-hover:opacity-100'>
					<HugeiconsIcon
						icon={Camera02Icon}
						size={20}
					/>
				</span>
			</div>
			<input
				id='avatar'
				type='file'
				accept='image/*'
				hidden
				onChange={(e) => handleUploadAvatar(e)}
				disabled={isUpdatingProfile || isUploadingImages || isDestroyingImages}
			/>
		</label>
	);
};

export default UserAvatar;
