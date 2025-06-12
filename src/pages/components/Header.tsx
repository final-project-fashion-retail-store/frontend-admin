type Props = {
	title: string;
	description: string;
	className?: string;
};

const Header = ({ title, description, className }: Props) => {
	return (
		<div className={`w-full ${className}`}>
			<h1 className='font-black text-2xl max-md:text-lg'>{title}</h1>
			<p className='text-muted-foreground text-base max-md:text-sm'>
				{description}
			</p>
		</div>
	);
};

export default Header;
