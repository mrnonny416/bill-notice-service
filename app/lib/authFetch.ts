
// A simple wrapper around fetch to handle authentication.
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token is found, redirect to login page.
    // This is a client-side redirect.
    window.location.href = '/admin/login';
    // Return a promise that will never resolve to prevent further execution
    return new Promise(() => {});
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If the token is invalid or expired, clear it and redirect to login.
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
    // Return a promise that will never resolve
    return new Promise(() => {});
  }

  return response;
};

export default authFetch;
