# CAST Digital — Landing Page

Landing page CAST Digital (creative agency, Kota Serang). Tujuan utama halaman: mengarahkan pengunjung untuk chat WhatsApp.

Situs statis murni (HTML/CSS/JS), tanpa build tool — bisa langsung di-deploy ke hosting apa pun (Netlify, Vercel, GitHub Pages, cPanel).

## Struktur

```
index.html            Landing page
testimoni.html        Form testimoni untuk klien (tidak ditautkan dari navigasi utama)
assets/
  css/main.css        Seluruh style + token warna brand
  js/config.js        Nomor WA, template pesan WA, konfigurasi Supabase
  js/wa.js            Pembuat link WA + tracking klik (GA4 / GTM / Meta Pixel)
  js/main.js          Navigasi, animasi, video, dialog karya, FAQ, form konsultasi
  js/testimonials.js  Memuat testimoni yang sudah disetujui
  js/testimoni-form.js
  img/                brand, clients, team, bts, services, work, posters
  video/              Video yang sudah dikompres (≤ 5 MB)
supabase/schema.sql   Tabel & RLS testimoni
docs/brand/           Brand guideline & company profile (sumber, tidak dipakai situs)
```

## Menjalankan lokal

```
python -m http.server 8000
```

Buka http://localhost:8000.

## Tugas umum

- **Ganti nomor / isi pesan WhatsApp:** `assets/js/config.js`. Setiap tombol punya atribut `data-wa="..."` yang menentukan template pesannya.
- **Tambah logo klien:** taruh PNG transparan di `assets/img/clients/`, lalu tambahkan `<li>` di kedua `<ul class="logo-track">` di `index.html` (yang kedua adalah duplikat untuk animasi). Klien tanpa logo memakai `<li class="wordmark">Nama</li>`.
- **Tambah hasil karya:** salin satu `<button class="work-card">` di section `#karya`. Video sebaiknya vertikal 9:16, dikompres ≤ 5 MB, dan diberi poster di `assets/img/posters/`.
- **Menyetujui testimoni:** di dashboard Supabase, ubah `is_approved` menjadi `true`. Section testimoni muncul otomatis bila ada minimal satu testimoni yang disetujui.
- **Font Boston Angel:** taruh `boston-angel.woff2` di `assets/fonts/` lalu aktifkan blok `@font-face` di awal `main.css`. Sebelum itu, headline memakai DM Serif Display.
- **Tracking konversi:** pasang snippet GA4/GTM/Meta Pixel di `<head>`. Setiap klik WA otomatis mengirim event `wa_click` (dataLayer), `generate_lead` (gtag), dan `Contact` (fbq).

## Kompres video

```
ffmpeg -i input.mp4 -vf "scale=720:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart -c:a aac -b:a 96k output.mp4
```
