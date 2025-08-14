import Login from '@/pages/Login';
import { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { Routes } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/pages/Dashboard/Dashboard';
import { useAuthStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon } from '@hugeicons/core-free-icons';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import MainLayout from '@/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserSettings from '@/pages/UserSettings';
import Profile from '@/pages/Profile/Profile';
import Appearance from '@/pages/Appearance/Appearance';
import { ThemeProvider } from '@/components/ThemeProvider';
import CustomerManagement from '@/pages/CustomerManagement/CustomerManagement';
import AddressManagement from '@/pages/AddressManagement/AddressManagement';
import StaffManagement from '@/pages/StaffManagement/StaffManagement';
import CategoryManagement from '@/pages/CategoryManagement/CategoryManagement';
import SubcategoryManagement from '@/pages/SubcategoryManagement/SubcategoryManagement';
import BrandManagement from '@/pages/BrandManagement/BrandManagement';
import ProductManagement from '@/pages/ProductManagement/ProductManagement';
import ProductForm from '@/pages/ProductManagement/Form/ProductFormContainer';
import Message from '@/pages/Message/Message';
import OrderManagement from '@/pages/OrderManagement/OrderManagement';

const App = () => {
	const [checkAuth, isCheckingAuth, authUser] = useAuthStore(
		useShallow((state) => [state.checkAuth, state.isCheckingAuth, state.authUser])
	);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) {
		return (
			<div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
				<HugeiconsIcon
					icon={Orbit01Icon}
					className='animate-spin'
				/>
			</div>
		);
	}

	console.table({
		VITE_BASE_URL: process.env.VITE_BASE_URL,
		HAS_VITE_X_API_KEY: !!process.env.VITE_X_API_KEY,
	});

	return (
		<ThemeProvider>
			<div className='font-display'>
				<Routes>
					<Route
						path='/'
						element={
							authUser ? (
								<ProtectedRoute allowedRoles={['admin', 'staff']}>
									<MainLayout />
								</ProtectedRoute>
							) : (
								<Navigate to={'/login'} />
							)
						}
					>
						<Route
							index
							element={<Navigate to='dashboard' />}
						/>
						<Route
							path='dashboard'
							element={<Dashboard />}
						/>
						<Route
							path='manage-customers'
							element={<CustomerManagement />}
						/>
						<Route
							path='manage-employees'
							element={<StaffManagement />}
						/>
						<Route
							path='manage-addresses'
							element={<AddressManagement />}
						/>
						<Route
							path='manage-products'
							element={<ProductManagement />}
						>
							<Route
								path='create'
								element={
									<ProductForm
										title='Add New Product'
										description='Create a new product with variants and specifications'
										buttonTitle='Create Product'
									/>
								}
							/>
							<Route
								path=':slug/edit'
								element={
									<ProductForm
										title='Edit Product'
										description='Update product information, variants, and specifications'
										buttonTitle='Update Product'
									/>
								}
							/>
						</Route>
						<Route
							path='manage-categories'
							element={<CategoryManagement />}
						/>
						<Route
							path='manage-subcategories'
							element={<SubcategoryManagement />}
						/>
						<Route
							path='manage-brands'
							element={<BrandManagement />}
						/>
						<Route />
						<Route
							path='orders'
							element={<OrderManagement />}
						/>
						<Route
							path='messages'
							element={<Message />}
						/>
					</Route>
					<Route
						path='/login'
						element={authUser ? <Navigate to={'/'} /> : <Login />}
					/>
					<Route
						path='/forgot-password'
						element={authUser ? <Navigate to={'/'} /> : <ForgotPassword />}
					/>
					<Route
						path='/reset-password/:resetPasswordToken'
						element={authUser ? <Navigate to={'/'} /> : <ResetPassword />}
					/>
					<Route
						path='/setting'
						element={
							authUser ? (
								<ProtectedRoute allowedRoles={['admin', 'staff']}>
									<UserSettings />
								</ProtectedRoute>
							) : (
								<Navigate to={'/login'} />
							)
						}
					>
						<Route
							index
							element={<Navigate to={'profile'} />}
						/>
						<Route
							path='profile'
							element={<Profile />}
						/>
						<Route
							path='appearance'
							element={<Appearance />}
						/>
					</Route>
				</Routes>
				<Toaster />
			</div>
		</ThemeProvider>
	);
};

export default App;
