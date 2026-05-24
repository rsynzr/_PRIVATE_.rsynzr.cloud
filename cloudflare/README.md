# Habede Cloudflare Gate

Worker ini melindungi `/habede/birthday.html` dengan waktu dari:

```text
https://server-time.nazuraarsya.workers.dev/
```

Sebelum `2026-12-31T00:00:00+07:00`, akses ke `/habede/birthday.html` akan diarahkan ke `/habede/index.html`. Saat atau setelah tanggal itu, `/habede/index.html` akan diarahkan ke `/habede/birthday.html`.

## Pasang Lewat Dashboard

1. Buka Cloudflare Dashboard.
2. Masuk ke **Workers & Pages**.
3. Buat Worker baru, misalnya `habede-gate`.
4. Paste isi `cloudflare/worker.js`, lalu deploy.
5. Buka **Triggers** pada Worker itu.
6. Tambahkan route:

```text
ainuy.rsynzr.cloud/habede*
```

7. Pastikan DNS `ainuy.rsynzr.cloud` aktif proxy Cloudflare, warna awannya orange.
8. Purge cache Cloudflare untuk domain ini.

## Catatan

Kalau browser masih menampilkan error dari `static.cloudflareinsights.com`, itu biasanya analytics/Rocket Loader Cloudflare yang diblok browser. Script countdown sudah diberi `data-cfasync="false"` supaya Rocket Loader tidak mengubah script inti.
