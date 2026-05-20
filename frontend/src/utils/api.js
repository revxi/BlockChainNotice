const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const fetchNotices = () => request('/notices');

export const publishNotice = (title, content, address) =>
  request('/notices', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
    headers: { 'X-Wallet-Address': address || '' },
  });

export const deleteNotice = (id, address) =>
  request(`/notices/${id}`, {
    method: 'DELETE',
    headers: { 'X-Wallet-Address': address || '' },
  });
