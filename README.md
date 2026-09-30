# Hexotic Roleplay Landing Page

Landing page single-page untuk server SA-MP / open.mp Hexotic Roleplay. Didesain dengan estetika modern, responsif, dan ringan tanpa dependensi framework frontend (Pure HTML/CSS/JS).

## 1. Cara Mengisi `config.js`

Buka file `config.js` di root folder. Semua pengaturan penting ada di sana:
- `server.ip` & `server.port`: IP dan Port server SA-MP kamu.
- `server.maxSlots`: Fallback jumlah maksimal pemain jika API gagal memuat.
- `socials.discordGuildId`: Wajib diisi dengan Guild ID server Discord kamu agar widget anggota Discord berfungsi. Pastikan *Enable Server Widget* sudah dicentang di pengaturan Discord (Server Settings -> Widget).
- `download.clientLink`: Link langsung untuk mendownload client/launcher.
- `api.statusEndpoint`: Endpoint API untuk mengambil status pemain. Secara default menunjuk ke `/api/status`.

## 2. Cara Mengganti Warna / Font

Buka `css/style.css`. Di bagian `:root`, kamu bisa menyesuaikan variabel berikut:
- **Warna Aksen:** Ganti `--color-accent` dan `--color-accent-hover` (menggunakan format OKLCH) untuk mengubah warna tombol utama dan highlight. Contoh untuk biru cyan: `oklch(75% 0.15 220)`.
- **Warna Latar:** Ganti `--color-paper` (Latar belakang utama), `--color-paper-2` (Kartu), dan `--color-paper-3` (Hover state).
- **Font:** Kami menggunakan `Outfit` (Heading) dan `Inter` (Body). Untuk mengganti font, ubah link import Google Fonts di baris paling atas `style.css`, lalu perbarui `--font-display` dan `--font-body`.

## 3. Cara Deploy

Proyek ini menggunakan satu folder murni tanpa build-step, tetapi membutuhkan lingkungan serverless (seperti Vercel) untuk mengeksekusi script API.

**Deploy via Vercel (Rekomendasi):**
1. Instal Vercel CLI atau upload repositori ke GitHub.
2. Jika menggunakan GitHub, hubungkan repositori ke Vercel.
3. Vercel akan otomatis mengenali folder `api/` sebagai serverless function dan `index.html` sebagai file statis.
4. Selesai! Tidak ada *build command* yang diperlukan (kosongkan atau gunakan default).

*Catatan Vercel: Vercel memblokir koneksi UDP keluar (dgram) pada free tier. Jika API status (`/api/status.js`) gagal melakukan query UDP, kamu dapat mengubah isi `fetchStatus()` di `js/monitor.js` untuk langsung menembak API publik SA-MP seperti `https://api.samp-servers.net/v2/server/IP:PORT` (jika tidak punya VPS sendiri).*
