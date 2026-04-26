# Secure Scan Cert - Sertifikat Digital Anti Palsu

Secure Scan Cert adalah aplikasi web untuk membuat dan memverifikasi sertifikat digital menggunakan konsep hashing sebagai implementasi dasar Web3.

Project ini bertujuan untuk mengatasi pemalsuan sertifikat dengan memastikan bahwa setiap sertifikat memiliki identitas unik yang dapat diverifikasi.

---

## Fitur Utama
- Generate sertifikat digital
- Hash unik untuk setiap sertifikat (SHA-256)
- QR Code untuk verifikasi
- Validasi keaslian sertifikat (valid / tidak valid)
- Tampilan sederhana dan mudah digunakan
---

## Konsep Web3 yang Digunakan
Aplikasi ini mengadopsi konsep dasar blockchain, yaitu:
- Hashing (SHA-256) untuk menjaga integritas data  
- Immutability, yaitu data tidak dapat diubah tanpa terdeteksi  
- Verifikasi untuk memastikan keaslian sertifikat  

Jika data sertifikat diubah, maka hash akan berubah dan sistem akan mendeteksi sertifikat sebagai tidak valid.

---

## Demo
Tambahkan link deploy di sini (misalnya dari Vercel atau Netlify)
---

## Cara Menjalankan Project
```bash
npm install
npm run dev
