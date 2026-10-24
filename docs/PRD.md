# PRD — Landing Page CAST Digital

Catatan keputusan penting untuk landing page (`index.html`). Update setiap ada revisi dari klien.

## Desain

- **Gaya yang dipakai: desain OOB** — bold condensed (Archivo + DM Mono), section biru brand `#2230F2` dan putih, aksen cyan.
  - Revisi "hero terang + section Tentang + tab karya" **ditolak** (dinilai jelek). Jangan dipakai lagi tanpa persetujuan.
  - Versi cream lama juga tidak dipakai.
- **Navbar:** transparan di atas hero; setelah scroll jadi **satu bar glass biru full-width**. **Jangan** ada kapsul/pill glass terpisah di sekitar menu di atas bar (tampak "double").
- **Background section selang-seling biru ↔ putih** (class `.tone-blue` / `.tone-light`). Dua section bersebelahan yang tampil tidak boleh sama warnanya. Urutan saat ini:

  | Section | Tone |
  |---|---|
  | Hero | biru |
  | Audience band | cyan |
  | Klien | putih |
  | Masalah (pain) | biru |
  | Layanan | putih |
  | Hasil Karya | biru |
  | Promise | putih |
  | Proses | biru |
  | FAQ | putih |
  | CTA akhir | biru |
  | Footer | putih |

  Section tersembunyi (`hidden`): Studi Kasus dan Testimoni. Kalau salah satunya ditampilkan, atau ada section yang ditambah/dihapus, cek ulang urutan ini.

## Konten

- **Section Tim dihapus** (foto anggota tim + marquee behind-the-scenes), juga link "Tim" di navbar. Gambar di `assets/img/team/` dan `assets/img/bts/` masih disimpan kalau nanti dipakai lagi.
- **Testimoni masih dummy** dan disembunyikan — tampilkan hanya setelah ada testimoni asli klien (dengan izin).

## Teknis

- Hanya satu branch: `main`. Setiap push ke `main` langsung di-deploy ke production via Cloudflare Pages. Jangan buat branch lain.
- Setelah deploy, hard refresh (Ctrl+Shift+R) untuk menghindari tampilan versi lama dari cache.
