import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Props = {
	children?: React.ReactNode;
	title?: string;
	description?: string;
	handler?: (() => void)[];
	asChild?: boolean;
};

const AlertDialogCustom = ({
	children,
	title,
	description,
	handler = [() => {}],
	asChild = false,
}: Props) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild={asChild}>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handler[0]}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default AlertDialogCustom;
