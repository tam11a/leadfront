// Axios
import axios from "axios";
import config from "../config";

// Configuring root url
export const rootURL: string | undefined = config.apiURL;

// configuring axios on initial load with the authorization token from localstorage it exists
export const instance = axios.create({
	baseURL: rootURL,
	headers: {
		accept: "*/*",
	},
});

// Add trailing slash to all requests
instance.interceptors.request.use((config) => {
	if (config?.url?.[config.url.length - 1] !== "/") {
		config.url += "/";
	}
	return config;
});

// instance.interceptors.request.use((configuration) => {
// 	// Check if the token exists in cookies
// 	const token = authService.getToken();

// 	if (token) {
// 		configuration.headers.Authorization = `Bearer ${token}`;
// 	}

// 	configuration.headers.set("x-api-key", crypto?.encryptKey?.(config.xApiKey));

// 	return configuration;
// });

export default instance;
