// import { Button } from '@/components/ui/button';
import {
	Dialog,
	// DialogClose,
	DialogContent,
	DialogDescription,
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
	handleOpenChange?: (open: boolean) => void;
};

const DialogCustom = ({
	children,
	title,
	description,
	form,
	className,
	handleOpenChange,
}: Props) => {
	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className={`sm:max-w-[425px] max-h-[80vh] flex flex-col font-display ${className}`}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{form}
			</DialogContent>
		</Dialog>
	);
};

export default DialogCustom;
