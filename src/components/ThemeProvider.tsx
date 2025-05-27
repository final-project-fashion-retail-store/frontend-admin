import { useEffect } from 'react';
import { useThemeStore } from '@/store';

interface ThemeProviderProps {
	children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const { theme, updateActualTheme } = useThemeStore();

	useEffect(() => {
		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleChange = () => {
			if (theme === 'system') {
				updateActualTheme();
			}
		};

		mediaQuery.addEventListener('change', handleChange);

		// Initial theme setup
		updateActualTheme();

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme, updateActualTheme]);

	return <>{children}</>;
}
