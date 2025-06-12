export type SubcategoryType = {
	_id: string;
	parentCategory: {
		_id: string;
		name: string;
	};
	name: string;
	active: boolean;
};
