import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/ui/overlay';
import UpdateForm from '@/pages/Profile/UpdateForm';
import UserAvatar from '@/pages/Profile/UserAvatar';
import DialogCustom from '@/components/DialogCustom';
import UpdatePasswordForm from '@/pages/Profile/UpdatePasswordForm';

const Profile = () => {
	const [authUser, isUpdatingProfile] = useAuthStore(
		useShallow((state) => [state.authUser, state.isUpdatingProfile])
	);

	return (
		<div className='w-full px-2'>
			{isUpdatingProfile && <Overlay />}
			{/* Heading */}
			<h2 className='font-semibold text-xl max-md:text-lg'>Profile</h2>
			<Separator className='my-6' />
			{/* Body */}
			<div className='w-full h-full 2xl:max-[1537px]:max-h-[400px] overflow-y-auto'>
				{/* avatar */}
				<div className='w-full flex items-center justify-center gap-2'>
					<UserAvatar />
					<div className='flex flex-col items-start justify-center'>
						{/* user info */}
						<p className='font-semibold text-lg max-md:text-base'>
							{authUser?.fullName}
						</p>
						<p className='text-foreground/70 text-sm'>{authUser?.role}</p>
						<p className='text-foreground/70 text-sm'>{authUser?.email}</p>
					</div>
				</div>
				{/* form */}
				<div className='w-[60%] max-md:w-full mx-auto mt-6'>
					<UpdateForm />
					<Separator className='my-8 max-md:my-6' />
					{/* Change password */}
					<div className='w-full flex flex-col justify-start items-start gap-2'>
						<span className='text-sm font-medium'>Password</span>
						<DialogCustom
							title='Change Password'
							description='Make changes to your password here'
							form={<UpdatePasswordForm />}
						>
							<Button variant={'outline'}>Change your password</Button>
						</DialogCustom>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
