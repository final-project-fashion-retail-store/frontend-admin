import type { PropsWithChildren } from 'react';
import { useAuthStore } from '../store';

type PropsType = PropsWithChildren & {
	allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles, children }: PropsType) => {
	const authUser = useAuthStore((state) => state.authUser);

	if (!authUser || (allowedRoles && !allowedRoles.includes(authUser.role))) {
		return (
			<div className='z-[9999] fixed inset-0 bg-base-100 flex flex-col gap-10 items-center justify-center'>
				<h1 className='font-black text-2xl text-primary-content'>Access Denied</h1>
				<p className='text-md font-bold text-primary-content/80'>
					You are not authorized to access this page.
				</p>
			</div>
		);
	}

	return children;
};

export default ProtectedRoute;
