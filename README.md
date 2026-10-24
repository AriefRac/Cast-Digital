# Landing Page CAST Digital

Landing page CAST Digital (creative agency, Kota Serang). Tujuan utama halaman: mengarahkan pengunjung untuk chat WhatsApp.

Situs statis (HTML/CSS/JS) tanpa framework dan tanpa database. `build.sh` hanya menyalin file situs ke `_site` dan mengisi alamat domain.

## Struktur

```
index.html            Landing page
404.html              Halaman tidak ditemukan
build.sh              Menyiapkan folder _site untuk deploy + mengisi domain dari SITE_URL
_headers              Header keamanan (CSP, dll.) & cache untuk Cloudflare Pages
robots.txt, sitemap.xml
assets/
  css/main.css        Seluruh style, token warna (palet), @font-face
  fonts/              DM Serif Display, DM Mono & DM Sans (woff2) + lisensi OFL (wajib ikut)
  js/config.js        Nomor WA dan template pesan WA
  js/wa.js            Pembuat link WA + tracking klik
  js/main.js          Navigasi, animasi, video, dialog karya, FAQ, form konsultasi
  img/                Gambar WebP: brand, clients, team, bts, services, work, posters
  video/              Video lengkap (hero & yang dibuka saat kartu karya diklik)
  video/previews/     Klip 8 detik tanpa suara untuk kartu Hasil Karya
docs/brand/           Brand guideline & company profile (sumber, tidak ikut dipublikasikan)
ref/                  (lokal saja, di .gitignore) Screenshot referensi desain
```

## Gaya visual

Latar belang: setiap section bergantian biru brand (#2230F2) dan putih, dimulai dari hero biru (dengan glow cyan) dan ditutup footer biru. Pita miring "For UMKM" menempel di sambungan hero biru dan section klien putih. Headline kapital condensed, label mono kapital, dan satu warna aksen untuk tombol utama, label, dan angka: cyan di bidang biru, biru di bidang putih.

### Tone section (latar belang)

Warna latar diatur lewat kelas di setiap `<section>` (dan `<footer>`):

| Kelas | Latar | Teks | Aksen & tombol utama |
|---|---|---|---|
| `tone-blue` | biru #2230F2 | putih | cyan, teks tombol gelap |
| `tone-light` | putih | gelap (`--ink`) | biru, teks tombol putih |
| `tone-dark` | navy #05061A | putih | cyan (dipakai untuk kartu gelap di panel "Starting from any price") |

Kelas tone juga mengganti token `--fg`, `--text-2`, `--accent`, `--accent-ink`, `--btn-hover`, `--line`, `--glass`, dan `--logo-filter`, jadi komponen di dalamnya (tombol, garis, kartu, logo klien) otomatis menyesuaikan. Kelas tone boleh dipakai di dalam section lain; contohnya kartu chat di section "Kenal sama situasi ini?" memakai `tone-light` di atas section biru.

Urutan saat ini: hero biru → klien putih → masalah biru → layanan putih → hasil karya biru → kenapa CAST putih → proses biru → tim putih → FAQ biru → konsultasi putih → footer biru. Section `#studi-kasus` (`tone-light`) dan `#testimoni` (`tone-blue`) masih tersembunyi; saat ditampilkan, tone section sesudahnya perlu ditukar supaya belangnya tetap berselang-seling.

Header selalu di atas biru: transparan di atas hero, lalu menjadi bar biru solid setelah halaman di-scroll, jadi logo putih tetap terbaca di atas section putih.

### Font

Semua font di-host sendiri di `assets/fonts/` karena CSP hanya mengizinkan font dari domain sendiri.

| Peran | Font | File | Sumber |
|---|---|---|---|
| Headline | DM Serif Display 400 + italic (pengganti gratis Boston Angel) | `dm-serif-display-latin.woff2`, `dm-serif-display-italic-latin.woff2` | Google Fonts / `@fontsource/dm-serif-display` |
| Label | DM Mono 500 | `dm-mono-latin-500.woff2` | `npm pack @fontsource/dm-mono` → `files/dm-mono-latin-500-normal.woff2` |
| Body | DM Sans (font brand) | `dm-sans-latin.woff2` | sudah ada sejak awal |

- Lisensi masing-masing (SIL OFL) ada di `assets/fonts/OFL-*.txt` dan wajib ikut dipublikasikan.
- Panduan brand memakai **Boston Angel** untuk headline. Font itu berbayar, jadi sementara diganti DM Serif Display yang bentuknya paling mirip. Kalau file Boston Angel berlisensi web sudah ada, ganti `@font-face` dan `--font-display` di `main.css`.
- Untuk kata berhubung yang tidak boleh patah, pakai tanda hubung biasa di dalam `<span class="nowrap">`.
- Kalau font diganti, sesuaikan juga `<link rel="preload">` di `<head>` `index.html`.

### Mengganti palet

Warna brand diatur lewat token di `:root` bagian atas `assets/css/main.css`:

- `--blue` (#2230F2): latar section `tone-blue`, aksen di bidang putih, bubble chat CAST, pilihan di form, awal gradien panel "Starting from any price".
- `--cyan` (#25F8FF): aksen di bidang biru (tombol utama, label, angka), pita "For UMKM", akhir gradien panel. Jangan dipakai sebagai teks di atas putih karena kontrasnya terlalu rendah.
- `--navy` (#05061A): "hitam" brand untuk teks gelap di atas cyan, kartu gelap, menu HP, dan badge WhatsApp.

Token per tone (`--fg`, `--accent`, dst.) ada tepat di bawah `:root`; lihat bagian Tone section di atas.

Palet alternatif (ungu #7A2CFF + lime #D4FF3A) sudah ditulis sebagai komentar di `:root`; tinggal tukar dua barisnya. Setelah mengganti palet, cek ulang kontras teks (minimal WCAG AA): teks putih dan aksen di atas `--blue`, `--blue` di atas putih, serta panel gradien (teks putih di bagian atas panel, teks gelap di bagian bawah).

### Logo klien

Logo di strip klien diwarnai satu warna lewat CSS (token `--logo-filter`: hitam di bidang putih, putih di bidang biru), jadi file logo harus berlatar transparan. Logo berlatar solid akan tampil sebagai kotak polos. Lima logo yang awalnya berlatar solid sudah dibuatkan versi transparan (`*-v2.webp`).

## Menjalankan lokal

```
python -m http.server 8000
```

Buka http://localhost:8000. Alamat `castdigital.example` di `<head>`, `robots.txt`, dan `sitemap.xml` memang placeholder; diisi otomatis saat build.

## Tugas umum

- **Ganti nomor / isi pesan WhatsApp:** `assets/js/config.js`. Setiap tombol punya atribut `data-wa="..."` yang menentukan template pesannya.
- **Tambah logo klien:** WebP berlatar transparan setinggi ±112 px di `assets/img/clients/` (lihat bagian Logo klien di atas), lalu tambahkan `<li>` di kedua `<ul class="logo-track">` (yang kedua duplikat untuk animasi). Klien tanpa logo memakai `<li class="wordmark">Nama</li>`.
- **Tambah hasil karya:** salin satu `<button class="work-card">` di section `#karya`. `data-media` = video lengkap di `assets/video/` (≤ 5 MB), `data-src` = klip preview di `assets/video/previews/`, `poster` = WebP di `assets/img/posters/`.
- **Mengganti gambar/video:** pakai nama file baru. Gambar & video di-cache browser 7 hari, jadi file dengan nama sama bisa tetap tampil versi lama.
- **Testimoni:** section `#testimoni` disembunyikan (atribut `hidden`) karena isinya masih dummy. Setelah ada testimoni asli (dan izin) dari klien, edit `<figure class="testi">`, hapus atribut `hidden`, lalu tambahkan lagi link "Testimoni" di navigasi footer. Sesuaikan juga tone section-nya (lihat Tone section).
- **Studi kasus:** section `#studi-kasus` (setelah Hasil Karya) berisi 3 kartu: iSell, Abinaya Desain, dan FKP Kota Serang. Section ini sengaja disembunyikan (atribut `hidden`) sampai ada data hasil asli dari klien. Setiap metrik masih berupa placeholder `[angka]`; jangan diisi angka perkiraan. Cara menampilkan: isi angka asli yang sudah disetujui klien, cek ulang kalimat tantangan bersama klien, lalu hapus atribut `hidden` dan sesuaikan tone section-nya (lihat Tone section).

## Tracking & CSP

`_headers` memasang Content-Security-Policy ketat: hanya file dari domain sendiri yang boleh dimuat. Akibatnya:

- **Cloudflare Web Analytics** (gratis, tanpa cookie) sudah diizinkan. Aktifkan di dashboard Pages → Metrics.
- **GA4 / Meta Pixel** perlu ditambahkan dulu ke CSP, dan snippet inline-nya dipindah ke file `.js` (skrip inline diblokir):
  - GA4: `script-src https://www.googletagmanager.com`, `connect-src https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`, `img-src https://*.google-analytics.com https://*.googletagmanager.com`
  - Meta Pixel: `script-src https://connect.facebook.net`, `connect-src https://www.facebook.com`, `img-src https://www.facebook.com`
- Setiap klik WA otomatis mengirim event `wa_click` (dataLayer), `generate_lead` (gtag), dan `Contact` (fbq) bila tracking terpasang.
- Satu-satunya skrip inline (`<script>` pertama di `<head>`) diizinkan lewat hash. Bila isinya diubah, hitung ulang hash-nya dan ganti di `_headers`:
  `printf '%s' "isi-skrip" | openssl dgst -sha256 -binary | openssl base64`

## Kompres media (ffmpeg)

```
# Video lengkap
ffmpeg -i input.mp4 -vf "scale=540:-2" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 64k output.mp4
# Klip preview kartu karya (8 detik, tanpa suara)
ffmpeg -i input.mp4 -t 8 -an -vf "scale=432:-2,fps=24" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart previews/output.mp4
# Poster video
ffmpeg -i input.mp4 -frames:v 1 -vf "scale=540:-2" -c:v libwebp -quality 72 poster.webp
# Foto → WebP (lebar maks. 900 px)
ffmpeg -i foto.jpg -vf "scale='min(900,iw)':-2" -c:v libwebp -quality 75 foto.webp
```

## Deploy (Cloudflare Pages)

Cloudflare Pages dipilih karena gratis, boleh untuk situs bisnis, bisa terhubung ke repo private, dan mendukung `_headers`.
GitHub Pages tidak dipakai: aturannya melarang dipakai untuk menjalankan bisnis online, dan repo private butuh paket berbayar.

1. Login Cloudflare → **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git** → pilih repo `Cast-Digital` (repo boleh tetap private).
2. Build settings: Framework preset **None**, Build command `sh build.sh`, Build output directory `_site`.
3. Environment variable (Production): `SITE_URL` = alamat situs. Awalnya alamat `*.pages.dev` yang diberikan Cloudflare, nanti diganti domain asli (mis. `https://castdigital.id/`). Tanpa variabel ini build sengaja gagal.
4. **Save and Deploy.** Setiap push ke `main` otomatis tayang; branch lain menjadi preview (otomatis `noindex`).
5. Domain sendiri: project → **Custom domains** → tambahkan domain. Domain utama (tanpa `www`) harus memakai nameserver Cloudflare; ikuti petunjuk di dashboard. Setelah aktif, ubah `SITE_URL` lalu **Retry deployment**.
6. Setelah live: daftarkan domain di Google Search Console dan kirim `sitemap.xml`.

## Sebelum dipromosikan

- [ ] Testimoni dummy diganti testimoni asli + izin klien (section masih `hidden`).
- [ ] Data hasil asli untuk section studi kasus (section masih `hidden`).
- [ ] Izin klien untuk logo dan karya yang ditampilkan.
- [ ] Izin anggota tim untuk foto dan nama (UU PDP No. 27/2022).
- [ ] Musik di video (showreel, iSell Entertainment, Abinaya, Enter English) berlisensi untuk dipakai di website. Audio dari library Instagram/TikTok hanya berlisensi di platform tersebut; kalau ragu, bisukan versi website.
- [ ] Project Supabase lama dihapus (tidak dipakai lagi).
- [ ] Google Business Profile CAST Digital dibuat/diklaim dan dihubungkan ke domain.
- [ ] Link di bio Instagram & TikTok diganti ke domain baru.
