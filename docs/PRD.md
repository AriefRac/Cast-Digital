# PRD — Landing Page CAST Digital

Catatan keputusan penting untuk landing page (`index.html`). Update setiap ada revisi dari klien.

## Desain

- **Gaya yang dipakai: versi cream** (light, aksen biru `#2230F2` + cyan). Redesign gelap/bold condensed sudah dicoba lalu **ditolak** (dinilai jelek) dan di-revert. Jangan dipakai lagi tanpa persetujuan.
- **Navbar:** satu bar glass full-width (cream semi-transparan + blur). Menu HP memakai glass yang sama. **Jangan** ada kapsul/pill glass terpisah di sekitar menu di atas bar full-width (tampak "double").
- **Background section selang-seling:** dua section bersebelahan tidak boleh berwarna sama. Urutan saat ini:

  | Section | Background |
  |---|---|
  | Hero | cream |
  | Audience band | gradien biru → cyan |
  | Klien | putih |
  | Masalah (pain) | gelap (ink) |
  | Layanan | cream |
  | Hasil Karya | gelap (ink) |
  | Promise | biru |
  | Proses | cream |
  | Testimoni | putih |
  | FAQ | cream |
  | CTA akhir | gelap (ink) |

  Kalau menambah/menghapus section, cek ulang urutan ini.

## Konten

- **Section Tim dihapus** (termasuk foto anggota tim dan marquee behind-the-scenes), begitu juga link "Tim" di navbar. File gambar di `assets/img/team/` dan `assets/img/bts/` masih disimpan kalau nanti dipakai lagi.
- **Testimoni masih dummy** — ganti dengan testimoni asli klien (dengan izin) sebelum situs dipromosikan.

## Teknis

- Hanya satu branch: `main`. Setiap push ke `main` langsung di-deploy ke production via Cloudflare Pages. Jangan buat branch lain.
- Setelah deploy, hard refresh (Ctrl+Shift+R) untuk menghindari tampilan versi lama dari cache.
