import { useSidebar } from '@/components/ui/sidebar';
import { ArrowLeftToLine, ArrowRightToLine, PanelLeft } from 'lucide-react';
import { useState } from 'react';

const CustomSidebarTrigger = () => {
	const { toggleSidebar, open } = useSidebar();
	const [isHovering, setIsHovering] = useState(false);
	return (
		<button
			onClick={() => {
				toggleSidebar();
				setIsHovering(false);
			}}
			onMouseOver={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			className='size-full max-size-4'
		>
			{!isHovering ? (
				<PanelLeft className='size-full' />
			) : isHovering && open ? (
				<ArrowLeftToLine className='size-full' />
			) : (
				<ArrowRightToLine className='size-full' />
			)}
		</button>
	);
};

export default CustomSidebarTrigger;
