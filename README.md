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
  fonts/              Archivo, DM Mono & DM Sans (woff2) + lisensi OFL (wajib ikut)
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

Latar gelap dengan glow gradien yang diam saat scroll (`body::before`, `position: fixed`), headline kapital condensed, label mono kapital, dan satu warna aksen terang untuk tombol utama, label, dan angka.

### Font

Semua font di-host sendiri di `assets/fonts/` karena CSP hanya mengizinkan font dari domain sendiri.

| Peran | Font | File | Sumber |
|---|---|---|---|
| Headline | Archivo variable, dipakai dengan `font-stretch: 62%`, weight 800, kapital | `archivo-latin-wdth.woff2` | `npm pack @fontsource-variable/archivo` → `files/archivo-latin-wdth-normal.woff2` |
| Label | DM Mono 500 | `dm-mono-latin-500.woff2` | `npm pack @fontsource/dm-mono` → `files/dm-mono-latin-500-normal.woff2` |
| Body | DM Sans (font brand) | `dm-sans-latin.woff2` | sudah ada sejak awal |

- Lisensi masing-masing (SIL OFL) ada di `assets/fonts/OFL-*.txt` dan wajib ikut dipublikasikan.
- `@font-face` Archivo wajib memuat `font-stretch: 62% 125%` dan `font-weight: 100 900`; tanpa itu browser tidak memakai sumbu lebar (wdth) font variabel.
- Subset latin Archivo tidak punya tanda hubung tak-putus (U+2011). Untuk kata berhubung yang tidak boleh patah, pakai tanda hubung biasa di dalam `<span class="nowrap">`.
- Headline font brand (Boston Angel) tidak dipakai di desain ini; gayanya diganti headline condensed. Bricolage Grotesque juga sempat diuji, tapi tidak dipakai karena garis di dalam hurufnya tumpang-tindih saat diberi outline.
- Kalau font diganti, sesuaikan juga `<link rel="preload">` di `<head>` `index.html`.

### Mengganti palet

Semua warna diatur lewat token di `:root` bagian atas `assets/css/main.css`:

- `--bg` warna dasar halaman, `--accent` warna aksen, `--accent-ink` warna teks di atas aksen.
- `--glow-1` dan `--glow-2` warna glow latar. Keduanya juga dipakai untuk panel gradien "Starting from any price".
- `--blue` (#2230F2) khusus untuk bidang/latar (bubble chat CAST, pilihan di form). Jangan dipakai sebagai warna teks di atas latar gelap karena kontrasnya terlalu rendah.

Default memakai warna brand CAST (biru #2230F2 + cyan #25F8FF). Palet alternatif (aksen lime #D4FF3A, glow ungu #7A2CFF dan magenta #FF00AA) sudah ditulis sebagai komentar di `:root`; tinggal tukar empat barisnya. Setelah mengganti palet, cek ulang kontras teks (minimal WCAG AA), terutama di panel gradien: teks putih ada di bagian atas panel, teks gelap di bagian bawah.

### Logo klien

Logo di strip klien diputihkan lewat CSS (`filter: brightness(0) invert(1)`), jadi file logo harus berlatar transparan. Logo berlatar solid akan tampil sebagai kotak putih. Lima logo yang awalnya berlatar solid sudah dibuatkan versi transparan (`*-v2.webp`).

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
- **Testimoni:** section `#testimoni` disembunyikan (atribut `hidden`) karena isinya masih dummy. Setelah ada testimoni asli (dan izin) dari klien, edit `<figure class="testi">`, hapus atribut `hidden`, lalu tambahkan lagi link "Testimoni" di navigasi footer.
- **Studi kasus:** section `#studi-kasus` (setelah Hasil Karya) berisi 3 kartu: iSell, Abinaya Desain, dan FKP Kota Serang. Section ini sengaja disembunyikan (atribut `hidden`) sampai ada data hasil asli dari klien. Setiap metrik masih berupa placeholder `[angka]`; jangan diisi angka perkiraan. Cara menampilkan: isi angka asli yang sudah disetujui klien, cek ulang kalimat tantangan bersama klien, lalu hapus atribut `hidden`.

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
