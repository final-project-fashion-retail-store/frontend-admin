import { Button } from '@/components/ui/button';
import { useManagementStore } from '@/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
	page?: string;
	handleClickPagination: (paginationLink: string) => void;
};

const Pagination = ({ page, handleClickPagination }: Props) => {
	const pagination = useManagementStore((state) => state.pagination);

	return (
		<div className='w-full flex flex-row items-center justify-between'>
			<span className='text-muted-foreground text-sm'>
				{`Showing ${pagination?.accumulator} of ${pagination?.totalDocs} ${page}`}
			</span>
			{pagination && pagination.totalPages > 1 && (
				<div className='h-full flex items-center space-x-4 p-2'>
					<Button
						variant={'ghost'}
						disabled={!pagination.prevPage}
						onClick={() => {
							if (!pagination.prevPage) return;
							handleClickPagination(pagination.prevPage);
						}}
					>
						<ChevronLeft /> Previous
					</Button>
					<Button
						variant={'ghost'}
						disabled={!pagination.nextPage}
						onClick={() => {
							if (!pagination.nextPage) return;
							handleClickPagination(pagination.nextPage);
						}}
					>
						Next <ChevronRight />
					</Button>
				</div>
			)}
		</div>
	);
};

export default Pagination;
