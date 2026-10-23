#!/bin/sh
# Menyiapkan folder _site untuk dipublikasikan (Cloudflare Pages: build command "sh build.sh",
# output directory "_site"). Hanya file situs yang disalin; docs/ tidak ikut.
set -eu

: "${SITE_URL:?Isi variabel SITE_URL dengan alamat situs, contoh: https://castdigital.id/}"
case "$SITE_URL" in
  */) ;;
  *) SITE_URL="$SITE_URL/" ;;
esac

rm -rf _site
mkdir _site
cp -r index.html 404.html robots.txt sitemap.xml _headers assets _site/

for file in _site/index.html _site/robots.txt _site/sitemap.xml; do
  sed -i "s|https://castdigital.example/|$SITE_URL|g" "$file"
done
sed -i "s|<lastmod>[^<]*</lastmod>|<lastmod>$(date -u +%Y-%m-%d)</lastmod>|" _site/sitemap.xml

echo "Situs siap di _site untuk $SITE_URL"
