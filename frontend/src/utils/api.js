const BASE = '/api';

export const getToken  = ()  => localStorage.getItem('bn_token');
export const setToken  = (t) => localStorage.setItem('bn_token', t);
export const clearToken = ()  => localStorage.removeItem('bn_token');

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const fetchNotices   = ()              => request('/notices');
export const publishNotice  = (title, content) => request('/notices', { method: 'POST', body: JSON.stringify({ title, content }) });
export const deleteNotice   = (id)            => request(`/notices/${id}`, { method: 'DELETE' });
export const getNonce       = (address)       => request('/auth/nonce', { method: 'POST', body: JSON.stringify({ address }) });
export const verifySignature = (address, signature) =>
  request('/auth/verify', { method: 'POST', body: JSON.stringify({ address, signature }) });
