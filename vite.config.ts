import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
	// Load environment variables for the current mode (e.g., 'production', 'development')
	const env = loadEnv(mode, process.cwd(), '');

	return defineConfig({
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		define: {
			// Make environment variables available as process.env in the client
			'process.env': JSON.stringify(env),
			// Or selectively expose specific variables:
			// 'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
			// 'process.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE),
		},
	});
};
