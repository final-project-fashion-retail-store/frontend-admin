import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';

import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';

type TableColumn<T> = {
	key: keyof T;
	label: string;
	sortable?: boolean;
	className?: string;
};

// Generic props type
type Props<T> = {
	data: T[];
	isGettingData: boolean;
	handleClickSortField: (field: string) => void;
	columns: TableColumn<T>[];
	renderRow: (item: T, index: number) => React.ReactNode;
	emptyMessage?: string;
};

const TableCustom = <T extends Record<string, unknown>>({
	data,
	isGettingData,
	handleClickSortField,
	columns,
	renderRow,
	emptyMessage = 'No data available',
}: Props<T>) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					{columns.map((column) => (
						<TableHead
							key={String(column.key)}
							className={column.className}
						>
							{column.sortable ? (
								<div
									className='size-full flex items-center justify-start'
									onClick={() => handleClickSortField(String(column.key))}
								>
									<span className='p-2 flex items-center justify-center gap-2 hover:bg-accent rounded-sm cursor-pointer'>
										{column.label}
										<ArrowUpDown className='size-4 max-size-4' />
									</span>
								</div>
							) : (
								column.label
							)}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data && data.length > 0 && !isGettingData ? (
					data.map((item, index) => renderRow(item, index))
				) : isGettingData ? (
					<TableRow>
						<TableCell
							colSpan={columns.length}
							className='bg-accent min-h-[200px] h-[200px]'
						>
							<div className='size-full flex items-center justify-center'>
								<HugeiconsIcon
									icon={Orbit01Icon}
									className='animate-spin'
								/>
							</div>
						</TableCell>
					</TableRow>
				) : (
					<TableRow>
						<TableCell
							colSpan={columns.length}
							className='text-center bg-accent min-h-[200px] h-[200px]'
						>
							{emptyMessage}
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default TableCustom;
