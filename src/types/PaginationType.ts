export type PaginationType = {
	totalDocs: number;
	totalPages: number;
	accumulator: number;
	currentPage: number;
	nextPage: string | null;
	prevPage: string | null;
};
