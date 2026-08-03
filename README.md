# Wynn Dev Portfolio

Portfolio interaktif untuk enam aplikasi Android/web buatan Wynn: My Library, ShuffleFit Pro, Aster Journal, Flowly, HabitVerse, dan MemoCard.

## Prinsip visual

- Satu circular animation engine berbasis React Three Fiber sebagai pusat pengalaman.
- Objek, warna, ring, partikel, dan wireframe berubah mengikuti proyek aktif.
- Animasi UI tetap memakai Framer Motion dan CSS.
- WebGL dimuat secara lazy, DPR dibatasi, partikel menyesuaikan perangkat, dan tersedia mode ringan/reduced motion.
- Detail proyek tetap dapat dibaca penuh tanpa WebGL.

## Data proyek

Konten portfolio diaudit dari repository, konfigurasi Capacitor/Expo, route aplikasi, deployment produksi Vercel, dan tampilan aplikasi yang sedang live. Repository aplikasi tidak diubah.

| Produk | Source utama | Demo |
| --- | --- | --- |
| My Library | `thematic-bibliotheca` | `thematic-bibliotheca.vercel.app` |
| ShuffleFit Pro | `gerak-cerdas-pro` | `gerak-cerdas-pro.vercel.app` |
| Aster Journal | `Aster-Journal` + web companion `jurnal-bintang` | `jurnal-bintang.vercel.app` |
| Flowly | `flowly-mindful-missions` | Tidak ditautkan sementara karena public build belum memuat bundle |
| HabitVerse | `habitverse-companion` | `habitverse-companion.vercel.app` |
| MemoCard | `memory-lane` | `memory-lane-three-ashy.vercel.app` |

## Development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Deployment discipline

Perubahan divalidasi lokal dan melalui GitHub Actions. Deployment Vercel dibuat setelah paket perubahan selesai, sehingga tidak diperlukan preview deployment untuk setiap commit kecil.
