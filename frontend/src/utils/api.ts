import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getUser, saveItem } from './storage';
import { isTokenExpired } from './auth';

axios.defaults.baseURL = 'http://localhost:3001';

// TypeScript interface for the User object
interface User {
  _id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

// TypeScript interface for token response
interface TokenResponse {
  accessToken: string;
}

interface AuthResponse extends AxiosResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    _id: string;
    email: string;
    name: string;
  };
}

/**
 * Axios Request Interceptor:
 * - Checks for token expiry before every request.
 * - If expired, refreshes the token using the refresh token.
 * - Attaches the new access token to request headers.
 */
axios.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  let user: User | null = getUser();
  config.headers = config.headers || {}; 
  if (user && isTokenExpired(user.accessToken)) {
    try {
      // Request new access token using the refresh token
      const refreshResponse: AxiosResponse<TokenResponse> = await axios.post('/user/refresh-token', {
        refreshToken: user.refreshToken,
      });

      user.accessToken = refreshResponse.data.accessToken;
      saveItem('user', user);

      config.headers['Authorization'] = `Bearer ${user.accessToken}`;
    } catch (error) {
      console.error('Failed to refresh token:', error);

      // Handle refresh token failure (e.g., force logout)
      user = null;
      saveItem('user', null);
    }
  } else if (user) {
    config.headers['Authorization'] = `Bearer ${user.accessToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Logs in a user by sending their email and password to the API.
 * @param email User's email
 * @param password User's password
 * @returns Axios response with the authentication tokens and user details
 */
export async function userLogin(email: string, password: string): Promise<AuthResponse> {
  try {
    const response: AuthResponse = await axios.post('/user/signin', { email, password });
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Unable to log in.');
  }
}

/**
 * Registers a new user by sending their name, email, and password to the API.
 * @param email User's email
 * @param name User's name
 * @param password User's password
 * @returns Axios response with the authentication tokens and user details
 */
export async function userRegister(email: string, name: string, password: string): Promise<AuthResponse> {
  try {
    const response: AuthResponse = await axios.post('/user/signup', { name, email, password });
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error('Unable to register.');
  }
}