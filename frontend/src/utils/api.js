const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const fetchNotices = () =>
  request('/notices', {
    headers: { 'Content-Type': 'application/json' },
  });

export const publishNotice = (title, content, address, files = []) => {
  const form = new FormData();
  form.append('title', title);
  form.append('content', content);
  for (const file of files) {
    form.append('files', file);
  }
  return request('/notices', {
    method: 'POST',
    body: form,
    headers: { 'X-Wallet-Address': address || '' },
  });
};

export const deleteNotice = (id, address) =>
  request(`/notices/${id}`, {
    method: 'DELETE',
    headers: { 'X-Wallet-Address': address || '' },
  });
