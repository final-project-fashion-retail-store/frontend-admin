import { Orbit01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const Overlay = () => {
	return (
		<div className='fixed bg-slate-200/50 top-0 left-0 right-0 bottom-0 flex items-center justify-center z-9999'>
			<HugeiconsIcon
				icon={Orbit01Icon}
				className='animate-spin'
			/>
		</div>
	);
};

export default Overlay;
