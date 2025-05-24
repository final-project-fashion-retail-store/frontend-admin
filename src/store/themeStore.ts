import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	actualTheme: 'light' | 'dark';
	updateActualTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
};

const getActualTheme = (theme: Theme): 'light' | 'dark' => {
	return theme === 'system' ? getSystemTheme() : theme;
};

export const useThemeStore = create<ThemeStore>()(
	persist(
		(set, get) => ({
			theme: 'system',
			actualTheme: getActualTheme('system'),
			setTheme: (theme: Theme) => {
				const actualTheme = getActualTheme(theme);

				// Update document class
				const root = window.document.documentElement;
				root.classList.remove('light', 'dark');
				root.classList.add(actualTheme);

				set({ theme, actualTheme });
			},
			updateActualTheme: () => {
				const { theme } = get();
				const actualTheme = getActualTheme(theme);

				// Update document class
				const root = window.document.documentElement;
				root.classList.remove('light', 'dark');
				root.classList.add(actualTheme);

				set({ actualTheme });
			},
		}),
		{
			name: 'theme-storage',
			onRehydrateStorage: () => (state) => {
				if (state) {
					// Initialize theme on app load
					const actualTheme = getActualTheme(state.theme);
					const root = window.document.documentElement;
					root.classList.remove('light', 'dark');
					root.classList.add(actualTheme);
					state.actualTheme = actualTheme;
				}
			},
		}
	)
);
