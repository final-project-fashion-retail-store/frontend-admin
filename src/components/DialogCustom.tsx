// import { Button } from '@/components/ui/button';
import {
	Dialog,
	// DialogClose,
	DialogContent,
	DialogDescription,
	// DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
	children?: React.ReactNode;
	title?: string;
	description?: string;
	form?: React.ReactNode;
	className?: string;
};

const DialogCustom = ({
	children,
	title,
	description,
	form,
	className,
}: Props) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className={`sm:max-w-[425px] max-h-[80vh] flex flex-col font-display ${className}`}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div className='flex-1 overflow-y-auto pr-2'>{form}</div>
				{/* <DialogFooter>
					<Button type='submit'>Save changes</Button>
				</DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
};

export default DialogCustom;
