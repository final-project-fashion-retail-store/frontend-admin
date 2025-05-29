import { create } from 'zustand';
import { AxiosError } from 'axios';

import {
	destroyImages,
	getDistrict,
	getProvinceCity,
	getWardCommune,
	uploadImages,
} from '@/services';
import type { DistrictType, ProvinceType, WardType } from '@/types';

type Store = {
	provinces: ProvinceType[] | null;
	districts: DistrictType[] | null;
	wards: WardType[] | null;
	isUploadingImages: boolean;
	isDestroyingImages: boolean;

	uploadImages: (
		data: FormData
	) => Promise<
		| { public_id: string; secure_url: string }
		| { public_id: string; secure_url: string }[]
	>;
	destroyImages: (data: { publicId: string[] }) => void;
	getProvinces: () => void;
	getDistricts: (provinceId: string) => void;
	getWards: (districtId: string) => void;
};

const useGeneralStore = create<Store>((set) => ({
	provinces: null,
	districts: null,
	wards: null,
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
}));

export default useGeneralStore;
