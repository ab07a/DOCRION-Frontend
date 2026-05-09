const API_BASE = import.meta.env.VITE_API_BASE;

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload-file`, {
    method: 'POST',
    headers: { 'ngrok-skip-browser-warning': 'true' },
    body: formData,
  });
  return res.json();
}

export async function queryDocument(session_id, query, top_k = 3) {
  const res = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({ session_id, query, top_k }),
  });
  return res.json();
}

export async function deleteSession(session_id) {
  const res = await fetch(`${API_BASE}/session/${session_id}`, {
    method: 'DELETE',
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
  return res.json();
}
