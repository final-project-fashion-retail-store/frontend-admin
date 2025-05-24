import { Separator } from '@/components/ui/separator';
import ThemeSelection from '@/pages/Appearance/ThemeSelection';

const Appearance = () => {
	return (
		<div className='w-full px-2'>
			{/* heading */}
			<div className='w-full'>
				<h2 className='font-semibold text-xl max-md:text-lg'>Appearance</h2>
				<p className='text-muted-foreground max-md:text-sm max-md:text-justify'>
					Customize the appearance of the app. Automatically switch between dark and
					light themes.
				</p>
			</div>
			<Separator className='my-4' />
			{/* body */}
			<div className='w-full'>
				{/* Themes */}
				<div className='w-full space-y-4 max-2xl:flex flex-col items-center'>
					<div>
						<h3 className='font-medium'>Theme</h3>
						<p className='text-muted-foreground text-sm'>
							Select the theme for the dashboard
						</p>
					</div>
					<div>
						<ThemeSelection />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Appearance;
