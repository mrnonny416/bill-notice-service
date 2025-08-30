// A custom error class for authentication errors
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// A simple wrapper around fetch to handle authentication.
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token is found, throw an error and redirect.
    window.location.href = '/admin/login';
    throw new AuthError('No token found. Redirecting to login.');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If the token is invalid or expired, clear it, redirect, and throw an error.
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
    throw new AuthError('Session expired. Redirecting to login.');
  }

  return response;
};

export default authFetch;