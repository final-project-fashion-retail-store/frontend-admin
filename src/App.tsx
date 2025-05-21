import Login from '@/pages/Login';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/pages/Dashboard';
import { useAuthStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';

const App = () => {
	const [checkAuth, isCheckingAuth, authUser] = useAuthStore(
		useShallow((state) => [state.checkAuth, state.isCheckingAuth, state.authUser])
	);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		console.log(authUser);
	}, [authUser]);

	if (isCheckingAuth || !authUser) {
		return (
			<div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
				<HugeiconsIcon
					icon={Orbit01Icon}
					className='animate-spin'
				/>
			</div>
		);
	}

	return (
		<div className='font-display'>
			<Routes>
				<Route
					path='/'
					element={authUser ? <Dashboard /> : <Navigate to='/login' />}
				/>
				<Route
					path='/login'
					element={authUser ? <Navigate to='/' /> : <Login />}
				/>
			</Routes>
			<Toaster />
		</div>
	);
};

export default App;
