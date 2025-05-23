import { destroyImages, uploadImages } from '@/services';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';

type Store = {
	isUploadingImages: boolean;
	isDestroyingImages: boolean;

	uploadImages: (
		data: FormData
	) => Promise<
		| { public_id: string; secure_url: string }
		| { public_id: string; secure_url: string }[]
	>;
	destroyImages: (data: { publicId: string[] }) => void;
};

const useGeneralStore = create<Store>((set) => ({
	isUploadingImages: false,
	isDestroyingImages: false,

	async uploadImages(data) {
		try {
			set({ isUploadingImages: true });
			const res = await uploadImages(data);
			if (res) {
				return res.data.images || res.data.image;
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				throw err;
			}
		} finally {
			set({ isUploadingImages: false });
		}
	},

	async destroyImages(data) {
		try {
			set({ isDestroyingImages: true });
			await destroyImages(data);
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				throw err;
			}
		} finally {
			set({ isDestroyingImages: false });
		}
	},
}));

export default useGeneralStore;
