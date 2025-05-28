type Props = {
	title: string;
	description: string;
};

const Header = ({ title, description }: Props) => {
	return (
		<div className='w-full'>
			<h1 className='font-black text-2xl'>{title}</h1>
			<p className='text-muted-foreground text-base'>{description}</p>
		</div>
	);
};

export default Header;
