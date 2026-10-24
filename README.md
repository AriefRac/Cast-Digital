# CAST Digital — Landing Page

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
  css/main.css        Seluruh style, token warna brand, @font-face
  fonts/              DM Sans & DM Serif Display (woff2) + lisensi OFL (wajib ikut)
  js/config.js        Nomor WA dan template pesan WA
  js/wa.js            Pembuat link WA + tracking klik
  js/main.js          Navigasi, animasi, video, dialog karya, FAQ, form konsultasi
  img/                Gambar WebP: brand, clients, team, bts, services, work, posters
  video/              Video lengkap (hero & yang dibuka saat kartu karya diklik)
  video/previews/     Klip 8 detik tanpa suara untuk kartu Hasil Karya
docs/brand/           Brand guideline & company profile (sumber, tidak ikut dipublikasikan)
```

## Menjalankan lokal

```
python -m http.server 8000
```

Buka http://localhost:8000. Alamat `castdigital.example` di `<head>`, `robots.txt`, dan `sitemap.xml` memang placeholder; diisi otomatis saat build.

## Tugas umum

- **Ganti nomor / isi pesan WhatsApp:** `assets/js/config.js`. Setiap tombol punya atribut `data-wa="..."` yang menentukan template pesannya.
- **Tambah logo klien:** WebP transparan setinggi ±112 px di `assets/img/clients/`, lalu tambahkan `<li>` di kedua `<ul class="logo-track">` (yang kedua duplikat untuk animasi). Klien tanpa logo memakai `<li class="wordmark">Nama</li>`.
- **Tambah hasil karya:** salin satu `<button class="work-card">` di section `#karya`. `data-media` = video lengkap di `assets/video/` (≤ 5 MB), `data-src` = klip preview di `assets/video/previews/`, `poster` = WebP di `assets/img/posters/`.
- **Mengganti gambar/video:** pakai nama file baru. Gambar & video di-cache browser 7 hari, jadi file dengan nama sama bisa tetap tampil versi lama.
- **Testimoni:** edit `<figure class="testi">` di section `#testimoni`. Isi saat ini masih dummy; ganti dengan testimoni asli (dan izin) dari klien.
- **Font Boston Angel:** butuh lisensi webfont. Taruh `boston-angel.woff2` di `assets/fonts/` lalu aktifkan blok `@font-face`-nya di `main.css`. Sebelum itu, headline memakai DM Serif Display.

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

- [ ] Testimoni dummy diganti testimoni asli + izin klien.
- [ ] Izin klien untuk logo dan karya yang ditampilkan.
- [ ] Izin anggota tim untuk foto dan nama (UU PDP No. 27/2022).
- [ ] Musik di video (showreel, iSell Entertainment, Abinaya, Enter English) berlisensi untuk dipakai di website. Audio dari library Instagram/TikTok hanya berlisensi di platform tersebut; kalau ragu, bisukan versi website.
- [ ] Project Supabase lama dihapus (tidak dipakai lagi).
- [ ] Google Business Profile CAST Digital dibuat/diklaim dan dihubungkan ke domain.
- [ ] Link di bio Instagram & TikTok diganti ke domain baru.
