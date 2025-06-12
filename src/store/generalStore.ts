import { create } from 'zustand';
import { AxiosError, type AxiosResponse } from 'axios';

import {
	destroyImages,
	getDistrict,
	getProvinceCity,
	getWardCommune,
	uploadImages,
} from '@/services';
import type { DistrictType, ProvinceType, WardType } from '@/types';
import { toast } from 'sonner';

type Store = {
	provinces: ProvinceType[] | null;
	districts: DistrictType[] | null;
	wards: WardType[] | null;
	uploadedImages: { public_id: string; secure_url: string }[] | null;
	isUploadingImages: boolean;
	isDestroyingImages: boolean;

	uploadImages: (data: FormData) => void;
	destroyImages: (data: {
		publicId: string[];
	}) => Promise<AxiosResponse | undefined>;
	setUploadedImages: (
		images: { secure_url: string; public_id: string }[]
	) => void;
	getProvinces: () => void;
	getDistricts: (provinceId: string) => void;
	getWards: (districtId: string) => void;
	resetStates: () => void;
};

const useGeneralStore = create<Store>((set) => ({
	provinces: null,
	districts: null,
	wards: null,
	uploadedImages: null,
	isUploadingImages: false,
	isDestroyingImages: false,

	async uploadImages(data) {
		try {
			set({ isUploadingImages: true });
			const res = await uploadImages(data);
			if (res.data.images) {
				set({ uploadedImages: res.data.images });
				return;
			}
			set({ uploadedImages: [res.data.image] });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
				toast.error('Failed to upload images');
			}
		} finally {
			set({ isUploadingImages: false });
		}
	},

	async destroyImages(data) {
		try {
			set({ isDestroyingImages: true });
			const res = await destroyImages(data);
			return res;
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		} finally {
			set({ isDestroyingImages: false });
		}
	},

	async getProvinces() {
		try {
			const res = await getProvinceCity();
			set({ provinces: res.data });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		}
	},

	async getDistricts(provinceId) {
		try {
			const res = await getDistrict(provinceId);
			set({ districts: res.data });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		}
	},

	async getWards(districtId) {
		try {
			const res = await getWardCommune(districtId);
			set({ wards: res.data });
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err);
				console.log(err?.response?.data?.message);
			}
		}
	},

	resetStates() {
		set({
			uploadedImages: null,
		});
	},

	setUploadedImages(images) {
		set({ uploadedImages: images });
	},
}));

export default useGeneralStore;
