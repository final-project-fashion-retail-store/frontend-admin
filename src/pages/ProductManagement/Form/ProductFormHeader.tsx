import { Button } from '@/components/ui/button';
import Header from '@/pages/components/Header';
import { ArrowLeft, Package } from 'lucide-react';

type Props = {
	title: string;
	description: string;
	buttonTitle: string;
	submitBtnRef: React.RefObject<HTMLButtonElement | null>;
	handleGoBack: () => void;
};

const ProductFormHeader = ({
	title,
	description,
	buttonTitle,
	submitBtnRef,
	handleGoBack,
}: Props) => {
	return (
		<div className='flex flex-col items-start xl:flex-row xl:items-center xl:justify-start max-sm:px-3 px-10 gap-4'>
			<Header
				className='order-1 xl:order-2'
				title={title}
				description={description}
			/>
			<div className='w-full flex flex-row items-center justify-between order-2 xl:contents max-sm:gap-4'>
				<Button
					className='xl:order-1'
					onClick={handleGoBack}
					variant={'outline'}
				>
					<ArrowLeft /> Back to Products
				</Button>

				<Button
					className='xl:order-3 xl:ml-auto'
					onClick={() => submitBtnRef.current?.click()}
				>
					<Package /> {buttonTitle}
				</Button>
			</div>
		</div>
	);
};

export default ProductFormHeader;
