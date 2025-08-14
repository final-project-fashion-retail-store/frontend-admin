// utils/axios.ts
import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// Create a base axios instance
const instance = axios.create({
	baseURL: process.env.VITE_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		'x-api-key': process.env.VITE_X_API_KEY,
	},
	withCredentials: true,
});

// Variables to manage token refresh state
let isRefreshing = false;
let failedQueue: {
	resolve: (value: unknown) => void;
	reject: (reason?: AxiosError) => void;
	config: AxiosRequestConfig;
}[] = [];

// Process the queue of failed requests
const processQueue = (error: AxiosError | null) => {
	failedQueue.forEach(({ resolve, reject, config }) => {
		if (error) {
			reject(error);
		} else {
			resolve(instance(config));
		}
	});

	failedQueue = [];
};

// Create a refreshToken function that can be set from outside
let refreshTokenFunction: () => void = async () => {
	throw new Error('refreshAccessToken not implemented');
};

// Export a function to set the refresh token function from stores
export const setRefreshTokenFunction = (fn: () => void) => {
	refreshTokenFunction = fn;
};

// Response interceptor - handle token refresh on 401 errors
instance.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config;

		if (!originalRequest) {
			return Promise.reject(error);
		}

		// Skip token refresh for certain requests
		if (originalRequest.headers?.skipAuthRefresh) {
			return Promise.reject(error);
		}

		// Handle 401 Unauthorized errors (expired token)
		if (error.response?.status === 401 && !originalRequest.headers['_retry']) {
			if (isRefreshing) {
				// If already refreshing, add this request to queue
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject, config: originalRequest });
				});
			}

			// Mark as retrying to prevent infinite loops
			originalRequest.headers['_retry'] = true;
			isRefreshing = true;

			try {
				// Attempt to refresh the token using the injected function
				await refreshTokenFunction();

				// Process any queued requests with new token
				processQueue(null);

				// Retry the original request with new token
				return instance(originalRequest);
			} catch (refreshError) {
				// Token refresh failed
				processQueue(refreshError as AxiosError);

				// Return the original error
				return Promise.reject(error);
			} finally {
				isRefreshing = false;
			}
		}

		// Return any other errors
		return Promise.reject(error);
	}
);

export default instance;
