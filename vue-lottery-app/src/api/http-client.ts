const BASE_URL = import.meta.env.VITE_API_URL;

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken, expiresInMins: 60 })
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem('accessToken', refreshData.accessToken);
          localStorage.setItem('refreshToken', refreshData.refreshToken);

          headers.set('Authorization', `Bearer ${refreshData.accessToken}`);
          response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired');
        }
      } catch (e) {
        throw e;
      }
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
