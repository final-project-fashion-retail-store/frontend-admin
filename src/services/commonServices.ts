import instance from '@/utils/axios';
import { isAxiosError } from 'axios';

export const uploadImages = async (data: FormData) => {
	try {
		const res = await instance.post('/images', data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return res.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const destroyImages = async (data: { publicId: string[] }) => {
	try {
		const res = await instance.delete('/images', { data });
		return res;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};
