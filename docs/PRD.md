# PRD — Landing Page CAST Digital

Catatan keputusan penting untuk landing page (`index.html`). Update setiap ada revisi dari klien.

## Desain

- **Gaya yang dipakai: desain OOB** — bold condensed (Archivo + DM Mono), section biru brand `#2230F2` dan putih, aksen cyan.
  - Section "Tentang" dari revisi lama **ditolak** (dinilai jelek). Jangan dipakai lagi tanpa persetujuan.
  - **Hero memakai gradien terang:** putih di kiri memudar ke biru → cyan di kanan/bawah (di HP memudar ke bawah), teks gelap. Pita audiens ada di ujung bawah hero.
  - Versi cream lama juga tidak dipakai.
- **Navbar:** transparan di atas hero (logo biru, teks gelap); setelah scroll jadi **satu bar glass biru full-width**. **Jangan** ada kapsul/pill glass terpisah di sekitar menu di atas bar (tampak "double").
- **Background section selang-seling biru ↔ putih** (class `.tone-blue` / `.tone-light`). Dua section bersebelahan yang tampil tidak boleh sama warnanya. Urutan saat ini:

  | Section | Tone |
  |---|---|
  | Hero | gradien terang (putih → biru/cyan) + pita audiens cyan |
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

- **Hasil Karya dipisah per jenis lewat tab: Reels, Design, Entertainment.** Poster event (FKP Piala Ibu Kota) masuk Design. Kalau menambah kartu, perbarui angka jumlah di tab-nya.
- **Section Tim dihapus** (foto anggota tim + marquee behind-the-scenes), juga link "Tim" di navbar. Gambar di `assets/img/team/` dan `assets/img/bts/` masih disimpan kalau nanti dipakai lagi.
- **Testimoni masih dummy** dan disembunyikan — tampilkan hanya setelah ada testimoni asli klien (dengan izin).

## Teknis

- Hanya satu branch: `main`. Setiap push ke `main` langsung di-deploy ke production via Cloudflare Pages. Jangan buat branch lain.
- Setelah deploy, hard refresh (Ctrl+Shift+R) untuk menghindari tampilan versi lama dari cache.
