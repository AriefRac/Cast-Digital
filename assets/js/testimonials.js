// Menampilkan testimoni yang sudah disetujui (is_approved = true) dari Supabase.
// Section testimoni tetap tersembunyi bila belum ada data atau Supabase tidak terjangkau.
(async () => {
  const section = document.getElementById('testimoni');
  const grid = document.getElementById('testiGrid');
  const { url, anonKey } = window.CAST_CONFIG.supabase || {};
  if (!section || !url || !anonKey) return;

  try {
    const response = await fetch(
      `${url.replace(/\/$/, '')}/rest/v1/testimonials?select=name,company,role,quote&is_approved=eq.true&order=created_at.desc&limit=6`,
      { headers: { apikey: anonKey } }
    );
    if (!response.ok) throw new Error(`Gagal memuat testimoni (${response.status})`);
    const items = await response.json();
    if (!items.length) return;

    grid.replaceChildren(...items.map(item => {
      const figure = document.createElement('figure');
      figure.className = 'testi reveal is-in';
      const quote = document.createElement('blockquote');
      quote.textContent = item.quote;
      const caption = document.createElement('figcaption');
      const name = document.createElement('strong');
      name.textContent = item.name;
      const role = document.createElement('span');
      role.textContent = [item.role, item.company].filter(Boolean).join(', ');
      caption.append(name, role);
      figure.append(quote, caption);
      return figure;
    }));
    section.hidden = false;
  } catch (error) {
    console.error(error);
  }
})();
