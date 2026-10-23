// Pengaturan utama situs. Ubah di sini saja — semua tombol WhatsApp ikut berubah.
window.CAST_CONFIG = {
  whatsapp: '6289510337201',

  // Pesan WhatsApp otomatis sesuai tombol yang diklik (lihat atribut data-wa di HTML).
  messages: {
    default: 'Halo CAST Digital, saya mau konsultasi gratis untuk brand saya.',
    'service-smm': 'Halo CAST Digital, saya tertarik dengan layanan Social Media Management. Boleh info lebih lanjut?',
    'service-content': 'Halo CAST Digital, saya tertarik dengan layanan Content Creation. Boleh info lebih lanjut?',
    'service-event': 'Halo CAST Digital, saya tertarik dengan layanan Event Coverage. Boleh info lebih lanjut?',
    portfolio: 'Halo CAST Digital, saya sudah lihat hasil karya kalian dan mau bikin konten serupa untuk brand saya.',
    price: 'Halo CAST Digital, saya mau tanya harga. Kebutuhan dan budget saya kira-kira: ',
    pain: 'Halo CAST Digital, saya mau cerita soal kondisi sosmed brand saya: ',
    faq: 'Halo CAST Digital, saya ada pertanyaan: '
  },

  // Supabase untuk testimoni. Publishable key memang aman dipakai di frontend
  // selama Row Level Security aktif (lihat supabase/schema.sql).
  supabase: {
    url: 'https://wocqtimcvshpxirvtxeo.supabase.co',
    anonKey: 'sb_publishable_txvEgjzfcsH3aLdXZSbAvw_0DWExmt-'
  }
};
