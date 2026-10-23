// Mengirim testimoni ke Supabase. Data masuk dengan is_approved = false dan
// baru tampil di beranda setelah disetujui lewat dashboard Supabase.
const form = document.getElementById('testimonialForm');
const status = document.getElementById('testimonialStatus');
const { url, anonKey } = window.CAST_CONFIG.supabase || {};

const setStatus = (message, state = '') => {
  status.textContent = message;
  status.dataset.state = state;
};

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!url || !anonKey) {
    setStatus('Form belum aktif: konfigurasi Supabase di assets/js/config.js belum diisi.', 'error');
    return;
  }

  const data = new FormData(form);
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  setStatus('Mengirim testimoni...');

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/testimonials`, {
      method: 'POST',
      headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.get('name').trim(),
        company: data.get('company').trim(),
        role: data.get('role').trim(),
        quote: data.get('quote').trim(),
        consented_at: new Date().toISOString()
      })
    });
    if (!response.ok) throw new Error(`Testimoni gagal dikirim (${response.status}).`);
    form.reset();
    setStatus('Terima kasih! Testimoni kamu sudah diterima dan akan tampil setelah ditinjau tim CAST.', 'success');
  } catch (error) {
    console.error(error);
    setStatus(`${error.message} Silakan coba lagi.`, 'error');
  } finally {
    submit.disabled = false;
  }
});
