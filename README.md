# Sistem Pendukung Keputusan Pemilihan Pemain Tim Dota 2 Universitas 45 Surabaya (IEL University)

Repo ini berisi implementasi Sistem Pendukung Keputusan (SPK) untuk pemilihan pemain tim Dota 2 Universitas 45 Surabaya dalam konteks Indonesia Esport League (IEL) University. Sistem ini menggunakan metode SAW-TOPSIS (Simple Additive Weighting - Technique for Order of Preference by Similarity to Ideal Solution) untuk membantu tim dalam memilih pemain yang optimal berdasarkan kriteria yang telah ditentukan.

## Struktur Direktori

- `index.html`: Halaman utama aplikasi SPK.
- `script.js`: Berkas JavaScript yang mengontrol logika dan fungsi-fungsi aplikasi.
- `players.json`: Berkas JSON yang berisi data pemain Dota 2.
- `style.css`: Berkas CSS yang digunakan untuk tampilan aplikasi.

## Instalasi

Karena aplikasi menggunakan fetch untuk mengambil data dari `players.json`, Anda dapat menggunakan ekstensi Live Server pada Visual Studio Code atau mengikuti langkah-langkah berikut untuk menjalankan aplikasi SPK di lingkungan lokal:

1. Clone repositori ini ke komputer Anda.
2. Buka Visual Studio Code dan buka direktori repositori.
3. Klik kanan pada berkas `index.html` dan pilih "Open with Live Server".
4. Halaman aplikasi SPK akan terbuka di browser Anda.

## Penggunaan

Setelah mengakses aplikasi SPK melalui `index.html`, Anda dapat mengikuti langkah-langkah berikut untuk memilih pemain tim Dota 2 Universitas 45 Surabaya:

1. Kriteria yang akan digunakan untuk pemilihan pemain telah ditentukan dan tersedia dalam aplikasi.
2. Atur bobot relatif untuk setiap kriteria yang telah ditentukan.
3. Klik tombol "Calculate" untuk mendapatkan hasil perangkingan pemain berdasarkan kriteria dan metode yang telah ditentukan.
4. Aplikasi akan menampilkan nama pemain dengan peringkat tertinggi akan direkomendasikan untuk menjadi bagian dari tim Dota 2 Universitas 45 Surabaya.

