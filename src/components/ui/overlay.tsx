import { Orbit01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const Overlay = () => {
	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] w-full h-full min-h-screen'>
			<HugeiconsIcon
				icon={Orbit01Icon}
				className='animate-spin text-white'
			/>
		</div>
	);
};

export default Overlay;
