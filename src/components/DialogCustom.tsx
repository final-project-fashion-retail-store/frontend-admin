import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
	children?: React.ReactNode;
	title?: string;
	description?: string;
	form?: React.ReactNode;
	handleConfirm?: () => void;
};

const DialogCustom = ({
	children,
	title,
	description,
	form,
	handleConfirm,
}: Props) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] font-display'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{form}
				{/* <DialogFooter>
					<Button type='submit'>Save changes</Button>
				</DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
};

export default DialogCustom;
