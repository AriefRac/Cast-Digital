// Membuat link WhatsApp dan mencatat setiap klik sebagai konversi.
(() => {
  const config = window.CAST_CONFIG;

  const waUrl = message => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;

  // Kirim event ke GA4 / Google Tag Manager / Meta Pixel bila sudah dipasang.
  const trackLead = source => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'wa_click', wa_source: source });
    if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { method: 'whatsapp', source });
    if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { source });
  };

  document.querySelectorAll('[data-wa]').forEach(link => {
    const source = link.dataset.wa;
    link.href = waUrl(config.messages[source] || config.messages.default);
    link.addEventListener('click', () => trackLead(source));
  });

  window.CAST_WA = { waUrl, trackLead };
})();
