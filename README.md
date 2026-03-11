# 🧬 InsideBacteria

**InsideBacteria** adalah aplikasi web edukatif interaktif untuk mempelajari struktur sel bakteri melalui model 3D yang bisa dijelajahi langsung di browser.

> Created with ❤️ by **widy4aa**

---

## 📸 Fitur Utama

- **3D Viewer Interaktif** — Putar, zoom, dan jelajahi model sel bakteri 3D secara real-time menggunakan Three.js
- **Label Anotasi** — 9 label organel yang terhubung langsung ke posisi 3D pada model dengan garis penghubung
- **Penjelasan Mendalam** — Setiap organel dilengkapi deskripsi ilmiah lengkap dan fakta seru
- **Panel Pengaturan** — Kontrol pencahayaan (kecerahan, cahaya utama, exposure), toggle visibilitas layer model, dan fokus per bagian
- **Optimasi Mobile** — Deteksi perangkat otomatis, rendering ringan untuk performa optimal di smartphone
- **Tema Dark Sci-Fi** — Desain gelap dengan efek bintang, grid animasi, dan glow neon

---

## 🏗️ Struktur Proyek

```
InsideBacteria/
├── index.html                  # Halaman beranda (landing page)
├── info.html                   # Halaman penjelasan organel sel bakteri
├── viewer.html                 # Halaman 3D Viewer
├── script.js                   # Logika utama Three.js (renderer, model, label, kontrol)
├── style.css                   # Stylesheet global (tema, layout, animasi)
├── conf.json                   # Konfigurasi posisi label anchor
├── start-server.bat            # Script untuk menjalankan local server
├── Bacterial cell structure/   # Folder model 3D
│   ├── model_0.obj             # Plasmid
│   ├── model_1.obj             # DNA Sirkuler
│   ├── model_2.obj             # Flagellum (bagian 1)
│   ├── model_3.obj             # Flagellum (bagian 2)
│   ├── model_4.obj             # Kapsul
│   ├── model_5.obj             # Dinding Sel
│   ├── model_6.obj             # Membran Sel
│   ├── model_7.obj             # Pili
│   ├── model_8.obj             # Ribosom
│   └── model_9.obj             # Sitoplasma
└── referensi/                  # Backup/referensi versi sebelumnya
```

---

## 🧫 Organel yang Ditampilkan

| # | Organel | Nama Inggris | Warna |
|---|---------|-------------|-------|
| 1 | Plasmid | Plasmid | 🟣 Ungu |
| 2 | DNA Sirkuler | Circular DNA | 🟣 Ungu muda |
| 3 | Flagellum | Flagellum | 🔵 Cyan |
| 4 | Kapsul | Capsule | 🟢 Teal |
| 5 | Dinding Sel | Cell Wall | 🟢 Hijau |
| 6 | Membran Sel | Cell Membrane | 🟡 Kuning |
| 7 | Pili | Pili / Fimbriae | 🔵 Biru |
| 8 | Ribosom | Ribosomes | 🔴 Merah |
| 9 | Sitoplasma | Cytoplasm | ⚪ Abu-abu |

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| [Three.js](https://threejs.org/) v0.163.0 | Rendering 3D, material, lighting |
| OBJLoader | Memuat model `.obj` |
| CSS2DRenderer | Label anotasi 3D |
| OrbitControls | Navigasi kamera (putar, zoom, geser) |
| EffectComposer + UnrealBloomPass | Post-processing bloom (desktop) |
| RoomEnvironment + PMREMGenerator | Environment map untuk refleksi IBL (desktop) |
| HTML / CSS / JavaScript | Struktur, styling, dan interaksi |

---

## 🚀 Cara Menjalankan

### Opsi 1 — Live Server (VS Code)
1. Install ekstensi **Live Server** di VS Code
2. Klik kanan `index.html` → **Open with Live Server**

### Opsi 2 — Python HTTP Server
```bash
cd path/ke/InsideBacteria
python -m http.server 8000
```
Buka `http://localhost:8000` di browser.

### Opsi 3 — Script Otomatis
Klik dua kali file `start-server.bat` (Windows). Script akan otomatis mendeteksi Python atau Node.js yang tersedia.

> **Catatan:** Aplikasi ini membutuhkan local server karena menggunakan ES Modules dan memuat file 3D model. Membuka `index.html` langsung (file://) tidak akan berfungsi.

---

## 📱 Optimasi Performa

Aplikasi secara otomatis mendeteksi perangkat sentuh (mobile/tablet) dan menyesuaikan rendering:

| Fitur | Desktop | Mobile |
|-------|---------|--------|
| Pixel Ratio | `min(devicePixelRatio, 2)` | `0.75` |
| Material | MeshPhysicalMaterial | MeshStandardMaterial |
| Shadows | ✅ Aktif | ❌ Nonaktif |
| Post-processing (Bloom) | ✅ Aktif | ❌ Nonaktif |
| Environment Map | ✅ Aktif | ❌ Nonaktif |
| Antialias | ✅ Aktif | ❌ Nonaktif |
| Detail Maps (Normal/Roughness) | ✅ Aktif | ❌ Nonaktif |
| Label Occlusion | ✅ Aktif | ❌ Nonaktif |

---

## 📄 Halaman

### 🏠 Beranda (`index.html`)
Landing page dengan hero section, penjelasan fitur, dan fakta menarik tentang bakteri.

### 📖 Pelajari (`info.html`)
Halaman kartu interaktif — 9 kartu organel yang bisa di-expand untuk melihat penjelasan ilmiah lengkap, fungsi, dan fakta seru.

### 🔬 3D Viewer (`viewer.html`)
Viewer utama dengan:
- Model 3D bakteri yang bisa diputar dan di-zoom
- Label anotasi pada setiap organel
- Panel pengaturan (pencahayaan, visibility layer, fokus bagian)
- Info popup saat klik organel
- Background atmosferik dengan gradient dan bintang

---

## 📋 Konfigurasi Label (`conf.json`)

Posisi anchor label dapat dikonfigurasi melalui file `conf.json`. Format:

```json
{
  "anchorsByModelId": {
    "0": [x, y, z],
    "1": [x, y, z]
  }
}
```

Koordinat `[x, y, z]` menentukan posisi 3D tempat label ditampilkan relatif terhadap model.

---

## 🌐 Browser Support

- Chrome 90+ ✅
- Firefox 90+ ✅
- Safari 15+ ✅
- Edge 90+ ✅
- Mobile Chrome / Safari ✅

> Membutuhkan dukungan WebGL 2.0 dan ES Modules.

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran biologi interaktif.
