import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
	children: React.ReactNode;
	content: string;
	asChild?: boolean;
};

const TooltipCustom = ({ children, content, asChild }: Props) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
				<TooltipContent>
					<p>{content}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipCustom;
