import axios, { isAxiosError } from 'axios';

export const getProvinceCity = async () => {
	try {
		const response = await axios.get(
			'https://open.oapi.vn/location/provinces/?size=63',
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const getDistrict = async (provinceId: string) => {
	try {
		const response = await axios.get(
			`https://open.oapi.vn/location/districts/${provinceId}/?size=30`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};

export const getWardCommune = async (districtId: string) => {
	try {
		const response = await axios.get(
			`https://open.oapi.vn/location/wards/${districtId}/?size=30`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch (err) {
		if (isAxiosError(err)) throw err;
	}
};
