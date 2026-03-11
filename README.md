# 🧬 InsideBacteria

**InsideBacteria** adalah website edukasi interaktif untuk mempelajari struktur sel bakteri melalui tampilan 3D yang bisa diputar langsung di browser.

README ini ditulis ulang untuk **menjelaskan kode dengan bahasa sederhana**, supaya orang yang belum pernah ngoding tetap bisa memahami cara kerja proyek ini.

---

## 1. Gambaran Besar Proyek

Kalau dijelaskan sangat sederhana, proyek ini punya pembagian tugas seperti ini:

- **HTML** = kerangka halaman
- **CSS** = tampilan visual halaman
- **JavaScript** = otak/interaksi halaman
- **OBJ 3D files** = bentuk model bakterinya
- **JSON** = data pengaturan label
- **BAT** = file bantu untuk menjalankan server lokal di Windows

Jadi alurnya begini:

1. Browser membuka halaman HTML.
2. HTML memanggil file CSS agar halaman terlihat bagus.
3. Khusus halaman viewer, HTML juga memanggil `script.js`.
4. `script.js` memuat model 3D, memberi warna/material, menyalakan kamera dan lampu.
5. Setelah model selesai dimuat, label dan panel interaksi ditampilkan.
6. Pengguna bisa klik label, fokus ke bagian tertentu, mengatur cahaya, dan menyembunyikan layer model.

---

## 2. Struktur File dan Fungsi Masing-Masing

```text
InsideBacteria/
├── index.html
├── info.html
├── viewer.html
├── script.js
├── style.css
├── conf.json
├── start-server.bat
├── index_old_viewer.html
└── Bacterial cell structure/
    ├── model_0.obj
    ├── model_1.obj
    ├── model_2.obj
    ├── model_3.obj
    ├── model_4.obj
    ├── model_5.obj
    ├── model_6.obj
    ├── model_7.obj
    ├── model_8.obj
    └── model_9.obj
```

Penjelasan singkatnya:

- `index.html` adalah halaman depan atau landing page.
- `info.html` adalah halaman penjelasan materi biologinya.
- `viewer.html` adalah halaman utama untuk melihat model 3D.
- `script.js` adalah kode paling penting, karena di sinilah semua logika viewer 3D berjalan.
- `style.css` mengatur seluruh tampilan website.
- `conf.json` menyimpan posisi label 3D.
- `start-server.bat` membantu menjalankan server lokal.
- `index_old_viewer.html` adalah versi viewer lama yang sekarang lebih berfungsi sebagai arsip/referensi.
- Folder `Bacterial cell structure/` berisi file model 3D `.obj`.

---

## 3. Cara Membaca Proyek Ini Jika Belum Pernah Ngoding

Kalau kamu belum pernah melihat kode sebelumnya, pakai cara baca ini:

- Lihat **HTML** sebagai daftar komponen yang muncul di layar.
- Lihat **CSS** sebagai aturan dekorasi dan posisi komponen.
- Lihat **JavaScript** sebagai instruksi: “kalau tombol diklik, lakukan apa”, “kalau model selesai dimuat, tampilkan apa”, dan seterusnya.

Analogi sederhananya:

- HTML itu seperti **rangka rumah**.
- CSS itu seperti **cat, lampu, dan dekorasi rumah**.
- JavaScript itu seperti **listrik dan sistem otomatis rumah**.

---

## 4. Penjelasan Detail Tiap File

### `index.html` — Halaman Beranda

File ini adalah pintu masuk utama website.

Isi utamanya:

- **Navbar**
  Berisi nama proyek dan link ke tiga halaman: Beranda, Pelajari, dan 3D Viewer.

- **Hero Section**
  Ini bagian pembuka paling besar. Tujuannya menarik perhatian pengguna dengan judul besar, deskripsi singkat, tombol aksi, dan elemen visual seperti emoji bakteri dan partikel melayang.

- **Features Section**
  Menjelaskan keunggulan website, misalnya model 3D interaktif, titik penjelasan, dan fakta seru.

- **Fun Facts Section**
  Menampilkan fakta-fakta singkat tentang bakteri agar halaman lebih edukatif dan menarik.

- **Footer**
  Menampilkan kredit pembuat.

- **Script kecil di bagian bawah**
  Dipakai untuk tombol hamburger di mobile. Saat tombol menu ditekan, navbar akan membuka atau menutup menu.

Kesimpulannya: `index.html` tidak berat secara logika. Tugasnya lebih ke menyusun isi halaman depan.

Contoh kode dari `index.html`:

```html
<nav class="navbar" id="navbar">
  <div class="nav-brand">
    <span>🧬</span> InsideBacteria
  </div>
  <ul class="nav-links" id="navLinks">
    <li><a href="index.html" class="active">Beranda</a></li>
    <li><a href="info.html">Pelajari</a></li>
    <li><a href="viewer.html">3D Viewer</a></li>
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Menu">☰</button>
</nav>
```

Potongan ini menunjukkan bahwa halaman depan punya navbar sederhana yang menghubungkan semua halaman utama.

---

### `info.html` — Halaman Materi / Penjelasan Organel

Halaman ini berisi penjelasan biologis setiap komponen sel bakteri.

Strukturnya mirip `index.html`, tetapi isi utamanya adalah kumpulan **kartu organel**.

Setiap kartu punya:

- ikon organel
- nama organel
- subjudul
- deskripsi utama
- fakta seru
- efek expand/collapse saat kartu diklik

Bagian penting yang perlu dipahami:

- `onclick="this.classList.toggle('expanded')"`
  Artinya, saat kartu diklik, class `expanded` akan ditambah atau dihapus.
  CSS kemudian membaca class ini untuk menentukan apakah bagian detail ditampilkan atau tidak.

Jadi halaman ini sebenarnya sederhana: data penjelasan ditulis langsung di HTML, lalu CSS yang mengatur animasi buka-tutup kartunya.

Contoh kode dari `info.html`:

```html
<div class="org-card" style="--org-color: #a78bfa" onclick="this.classList.toggle('expanded')">
  <div class="org-top">
    <span class="org-emoji">🔮</span>
    <div>
      <div class="org-title">Plasmid</div>
      <div class="org-subtitle">DNA Ekstra-kromosomal</div>
    </div>
  </div>
  <div class="org-desc">
    Plasmid adalah molekul DNA berbentuk lingkaran kecil yang terpisah dari DNA utama.
  </div>
</div>
```

Baris `onclick="this.classList.toggle('expanded')"` adalah kunci efek buka-tutup kartu ini.

---

### `viewer.html` — Halaman 3D Viewer

Ini adalah wadah untuk sistem 3D.

Kalau `script.js` adalah mesin, maka `viewer.html` adalah dashboard tempat mesin itu dipasang.

Bagian utamanya:

- **Viewer Navbar**
  Berisi tombol kembali, nama proyek, tombol toggle label, dan tombol toggle pengaturan.

- **Canvas**
  Elemen `<canvas id="three-canvas">` adalah tempat Three.js menggambar model 3D.

- **Loading Overlay**
  Muncul saat model sedang dimuat. Ada spinner, progress bar, dan teks status.

- **Controls Hint**
  Memberi petunjuk ke pengguna cara memutar, zoom, dan geser model.

- **Info Popup**
  Kotak informasi yang muncul saat pengguna klik label atau fokus ke organel tertentu.

- **Settings Panel**
  Panel samping untuk:
  menghidupkan/mematikan layer model, mengatur cahaya, fokus ke bagian organel, dan reset kamera.

- **Import map**
  Ini memberi tahu browser bahwa library `three` dan `three/addons/` diambil dari CDN `jsdelivr`.

- **`<script type="module" src="script.js"></script>`**
  Baris ini menjalankan semua logika 3D dari file `script.js`.

Jadi `viewer.html` tidak berisi logika 3D yang kompleks. Ia lebih seperti “tempat duduk” untuk semua fitur yang dikendalikan oleh JavaScript.

Contoh kode dari `viewer.html`:

```html
<div id="viewer-wrap">
  <canvas id="three-canvas"></canvas>

  <div id="loading">
    <div class="spinner"></div>
    <div class="progress-wrap"><div id="progress-bar"></div></div>
    <div id="load-label">Memuat model…</div>
  </div>
</div>

<script type="module" src="script.js"></script>
```

Di sini terlihat bahwa viewer menyiapkan area canvas, loading screen, lalu menyerahkan logika utamanya ke `script.js`.

---

### `style.css` — Seluruh Tampilan Website

File ini mengatur hampir semua visual website.

Secara konsep, `style.css` dibagi menjadi beberapa kelompok besar.

#### A. Variabel warna dan font

Di bagian `:root`, didefinisikan banyak variabel seperti:

- `--bg-deep`
- `--cyan`
- `--purple`
- `--text`
- `--font-body`
- `--font-sci`

Tujuannya supaya warna dan font mudah dipakai ulang. Daripada menulis warna berkali-kali, cukup panggil variabelnya.

Contoh kode dari `style.css`:

```css
:root {
  --bg-deep: #06080e;
  --cyan: #22d3ee;
  --purple: #a78bfa;
  --text: #e2e8f0;
  --font-body: 'Nunito', sans-serif;
  --font-sci: 'Orbitron', sans-serif;
}
```

Jadi kalau warna cyan ingin diganti, cukup ubah satu tempat, lalu semua bagian yang memakai `var(--cyan)` akan ikut berubah.

#### B. Background global

Bagian `body::before` dan `body::after` membuat latar belakang berbintang dan efek twinkle.

Ini sebabnya website punya nuansa sci-fi / ruang angkasa.

#### C. Navbar

Class seperti `.navbar`, `.nav-brand`, `.nav-links`, dan `.hamburger` mengatur tampilan menu atas.

Fungsi utamanya:

- membuat navbar tetap di atas
- memberi efek transparan kaca
- membuat menu mobile bisa dibuka dengan hamburger

#### D. Tombol

Class `.btn`, `.btn-primary`, `.btn-secondary` dipakai di landing page.

Tujuan kode ini adalah menyatukan gaya tombol agar konsisten di seluruh website.

#### E. Landing page

Bagian seperti `.hero`, `.hero-grid`, `.hero-title`, `.particle`, `.features`, `.fact-card` dipakai untuk halaman depan.

Fungsinya:

- menyusun layout hero
- memberi animasi melayang
- membuat kartu fitur dan fakta menarik

#### F. Halaman info

Class `.org-grid`, `.org-card`, `.org-fun`, `.expand-hint` dipakai untuk kartu organel.

Logikanya sederhana:

- default: detail tersembunyi
- jika class `expanded` aktif: detail dibuka dengan animasi

#### G. Halaman viewer

Bagian ini paling penting untuk interaksi 3D. Misalnya:

- `.viewer-nav`
- `#viewer-wrap`
- `#three-canvas`
- `#loading`
- `#controls-hint`
- `.label3d`
- `#info-popup`
- `.settings-panel`

Fungsinya antara lain:

- membuat area canvas memenuhi layar
- membuat overlay loading
- memberi gaya label angka dan nama organel
- membuat popup informasi
- membuat panel settings yang bisa disembunyikan

#### H. Responsive design

Bagian `@media (max-width: 768px)` mengatur tampilan mobile.

Contohnya:

- hero jadi vertikal
- menu navbar berubah menjadi hamburger
- grid kartu jadi satu kolom
- settings panel melebar penuh

#### I. Catatan penting pada file CSS ini

Di bagian bawah masih ada beberapa style viewer lama yang mirip dengan style viewer baru. Ini bukan error fatal, tetapi menunjukkan bahwa file CSS ini masih punya jejak evolusi desain. Jadi kalau nanti proyek ingin dirapikan, bagian ini bisa dikonsolidasi.

---

### `script.js` — Otak dari 3D Viewer

Ini adalah file terpenting di proyek.

Kalau dijelaskan dengan bahasa awam, `script.js` melakukan pekerjaan berikut:

1. Mengimpor mesin 3D dari Three.js.
2. Menyimpan data organel dan model.
3. Membaca konfigurasi posisi label.
4. Membuat tekstur permukaan model secara procedural.
5. Menyiapkan renderer, kamera, scene, lampu, dan kontrol mouse.
6. Memuat model `.obj` satu per satu.
7. Memberi material dan warna ke model.
8. Membuat label interaktif.
9. Mengatur popup, fokus kamera, settings panel, dan animasi.
10. Menjalankan loop render agar semuanya terus responsif.

Di bawah ini penjelasan per blok.

Contoh pembuka kode dari `script.js`:

```js
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
```

Potongan ini menunjukkan bahwa viewer 3D dibangun memakai modul-modul dari Three.js, bukan JavaScript murni tanpa library.

#### A. Import library

Baris paling atas mengimpor beberapa komponen dari Three.js:

- `THREE` untuk fungsi 3D utama
- `OBJLoader` untuk membuka file model `.obj`
- `OrbitControls` untuk putar/zoom kamera
- `CSS2DRenderer` dan `CSS2DObject` untuk label HTML yang ditempel di dunia 3D
- `RoomEnvironment` untuk refleksi cahaya
- `EffectComposer`, `RenderPass`, `UnrealBloomPass`, `OutputPass` untuk efek visual tambahan

Intinya: file ini tidak membangun engine 3D dari nol, tapi menggunakan engine Three.js.

#### B. Data `MODELS`

`MODELS` adalah daftar model 3D yang akan dimuat.

Setiap item berisi:

- `id`
- `name`
- `color`
- `roughness`
- `metalness`
- `clearcoat`
- `opacity`
- `emissive`

Artinya, data ini bukan penjelasan biologis, tetapi lebih ke **cara model terlihat di layar**.

Contoh mudahnya:

- warna apa yang dipakai
- mengilap atau tidak
- transparan atau tidak
- seberapa “bercahaya” tampilannya

#### C. Data `ORGANELLES`

Kalau `MODELS` fokus pada tampilan 3D, maka `ORGANELLES` fokus pada isi informasi.

Setiap organel punya:

- nomor label
- nama
- subjudul
- modelId yang menghubungkan organel ke model 3D
- ikon
- warna tema
- deskripsi singkat
- daftar detail / fakta

Jadi popup informasi dan tombol fokus organel mengambil data dari sini.

Contoh kode data `ORGANELLES`:

```js
{
  num: 1,
  name: 'Plasmid',
  sub: 'DNA Ekstra-kromosomal',
  modelId: 0,
  icon: '🔮',
  color: '#a78bfa',
  desc: 'Molekul DNA kecil berbentuk lingkaran yang terpisah dari DNA kromosom utama.',
  detail: [
    'Membawa gen resistensi antibiotik',
    'Bisa dipindahkan ke bakteri lain lewat konjugasi'
  ]
}
```

Artinya satu objek organel langsung menyimpan semua informasi yang dibutuhkan untuk label, warna, dan popup.

#### D. Konfigurasi label

Bagian `LABEL_LOCATION_CONFIG` mengatur posisi label agar menempel di tempat yang tepat pada model.

Karena setiap model punya bentuk berbeda, label tidak bisa otomatis selalu pas. Maka dipakai nilai offset seperti:

```js
anchorsByModelId: {
  0: [0.20, 0.35, 0.30]
}
```

Angka ini berarti: label untuk model tertentu digeser di sumbu X, Y, Z relatif terhadap ukuran model.

Contoh kode konfigurasi label:

```js
const LABEL_LOCATION_CONFIG = {
  labelEditable: 1,
  showGuideLines: false,
  fallbackAnchor: [0.15, 0.35, 0.15],
  anchorsByModelId: {
    0: [0.20, 0.35, 0.30],
    1: [-0.20, 0.28, 0.30]
  }
};
```

Jadi posisi label tidak ditebak browser, tetapi memang diatur dan bisa dikalibrasi.

Fungsi penting di bagian ini:

- `clamp()`
  Membatasi angka agar tidak keluar dari range tertentu.

- `ensureAnchorForModel()`
  Memastikan tiap model punya data posisi label.

- `parseLabelEditable()`
  Mengubah nilai seperti `0`, `1`, `true`, `false` menjadi bentuk yang konsisten.

- `isLabelEditingEnabled()`
  Mengecek apakah fitur edit label diaktifkan atau tidak.

- `getLabelConfigSnapshot()`
  Membuat salinan konfigurasi label saat ini untuk disimpan atau di-download.

- `applyLabelConfig()`
  Memasukkan konfigurasi dari file JSON atau localStorage ke dalam aplikasi.

- `saveLabelConfigToLocalStorage()`
  Menyimpan posisi label ke browser.

- `loadLabelConfigFromLocalStorage()`
  Mengambil posisi label yang pernah disimpan di browser.

- `loadLabelConfigFromFile()`
  Membaca `conf.json`.

- `downloadCurrentLabelConfig()`
  Mengunduh konfigurasi label saat ini sebagai file JSON.

- `initLabelLocationConfig()`
  Menjalankan urutan awal konfigurasi label: baca dari file, lalu override dari local storage jika ada.

#### E. Pembuatan tekstur slime procedural

Bagian ini termasuk yang paling teknis, tetapi idenya tetap bisa dijelaskan sederhana.

Tujuannya: membuat permukaan model terlihat lebih hidup, tidak terlalu polos.

Fungsi-fungsi seperti:

- `hash2D()`
- `smoothNoise()`
- `fbm()`

dipakai untuk membuat pola noise matematis.

Lalu fungsi:

- `makeSlimeNormalMap()`
- `makeSlimeRoughnessMap()`

mengubah pola itu menjadi tekstur yang bisa dipasang ke material 3D.

Artinya, proyek ini tidak hanya memberi warna datar ke model, tapi juga membuat kesan permukaan lendir/lunak khas bakteri.

Contoh kode fungsi sederhana pembuat noise:

```js
function fbm(x, y, octaves = 5) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2.1;
  }
  return val;
}
```

Walau terlihat matematis, intinya fungsi ini dipakai untuk membuat pola acak yang halus agar tekstur model tidak terlihat datar.

#### F. Setup renderer, scene, camera, dan controls

Ini adalah inti sistem 3D.

- `renderer`
  Bagian yang benar-benar menggambar dunia 3D ke canvas.

- `scene`
  Dunia 3D tempat semua objek dimasukkan.

- `camera`
  Sudut pandang pengguna.

- `controls`
  Membuat kamera bisa diputar, di-zoom, dan digeser dengan mouse/touch.

Ada juga `IS_TOUCH_DEVICE` dan objek `PERF`.

Ini sangat penting karena berarti proyek ini sadar bahwa perangkat mobile lebih lemah daripada desktop. Maka beberapa fitur berat dimatikan di mobile, misalnya:

- shadow
- bloom
- environment map
- material yang terlalu mahal secara performa

Jadi kode ini tidak hanya membuat sesuatu “jalan”, tapi juga mencoba menjaga performa tetap ringan.

Contoh kode pengaturan performa:

```js
const PERF = {
  maxPixelRatio: IS_TOUCH_DEVICE ? 0.75 : 2,
  usePostProcessing: !IS_TOUCH_DEVICE,
  useShadows: !IS_TOUCH_DEVICE,
  useEnvironment: !IS_TOUCH_DEVICE,
  enableLabelOcclusion: !IS_TOUCH_DEVICE,
};
```

Potongan ini menunjukkan bahwa proyek membedakan desktop dan mobile agar tetap ringan di HP.

#### G. `CSS2DRenderer`

Model 3D digambar di canvas WebGL. Tapi label angka dan nama organel lebih mudah dibuat sebagai elemen HTML biasa.

Karena itu dipakai `CSS2DRenderer`.

Keuntungannya:

- label lebih mudah distyle dengan CSS
- teks lebih tajam
- interaksi klik lebih gampang

#### H. Environment map dan lighting

Pencahayaan dibuat dari beberapa lampu:

- `hemiLight`
- `keyLight`
- `dl1`
- `dl2`
- `dl3`

Tujuannya bukan sekadar terang, tetapi memberi kesan studio / sinematik pada model.

Lalu ada environment map dari `RoomEnvironment`, yang membantu refleksi material terlihat lebih realistis.

#### I. Post-processing bloom

Bloom adalah efek cahaya lembut/glow pada objek terang.

Diaktifkan hanya saat performa memungkinkan.

Ini diatur oleh `EffectComposer` dan `UnrealBloomPass`.

Contoh kode bloom:

```js
if (PERF.usePostProcessing) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.32, 0.6, 0.7
  ));
}
```

Artinya, hasil render biasa diproses lagi supaya cahaya terlihat lebih dramatis.

#### J. Loading model `.obj`

Bagian ini adalah jantung proses pemuatan model.

`MODELS.forEach(def => { ... })`

Artinya: untuk setiap model dalam daftar, lakukan proses berikut:

1. Tentukan materialnya.
2. Muat file `.obj` dari folder `Bacterial cell structure/`.
3. Saat berhasil, tempelkan material ke semua mesh.
4. Simpan objek ke `meshMap`.
5. Masukkan objek ke `group` agar tampil di scene.
6. Update progress loading.

Ada logika tambahan menarik:

- Model kecil memakai tekstur fine agar detailnya tetap halus.
- Model `Pili` diberi **vertex color gradient** sehingga ujungnya lebih terang daripada pangkalnya.
- Model transparan memakai `DoubleSide` dan `depthWrite: false` supaya tampilannya benar.

Fungsi `onProgress()` akan:

- mengubah teks loading
- mengisi progress bar
- menutup loading overlay saat semua model selesai
- memanggil `fitCamera()`
- menerapkan warna akhir
- membuat label
- membangun cache mesh untuk occlusion

Contoh kode loading model:

```js
loader.load(
  `Bacterial cell structure/model_${def.id}.obj`,
  obj => {
    obj.traverse(c => { if (c.isMesh) c.material = mat; });
    meshMap[def.id] = obj;
    group.add(obj);
    loadedCount++;
    onProgress(loadedCount);
  }
);
```

Ini adalah momen saat file model benar-benar dibaca lalu dimasukkan ke dunia 3D.

#### K. `fitCamera()`

Fungsi ini sangat penting untuk pengalaman pengguna.

Ia menghitung ukuran seluruh model bakteri, lalu menaruh kamera pada posisi yang pas agar objek langsung terlihat utuh saat pertama dibuka.

Tanpa fungsi ini, kamera bisa terlalu dekat, terlalu jauh, atau bahkan tidak menghadap model.

#### L. `applyModelColors()`

Fungsi ini memastikan material tiap model sesuai dengan data di `MODELS`.

Kalau ada perubahan parameter visual, fungsi ini yang merapikannya kembali.

#### M. Pembuatan label 3D

Bagian label adalah salah satu fitur paling menarik di proyek ini.

Objek yang dipakai:

- `labels3D`
- `labelEls`
- `labelModelIds`
- `labelGuideLines`

Fungsi pentingnya:

- `syncLabelVisibility()`
  Menyamakan visibilitas label dengan status layer model dan tombol label.

- `rebuildLabelGuideLines()`
  Membuat ulang garis bantu dari objek ke label jika fitur guideline diaktifkan.

- `updateAllLabelPositions()`
  Menghitung ulang semua posisi label.

- `setSelectedTuneModel()`
  Memilih model aktif untuk pengaturan label.

- `startLabelAnchorDrag()`, `onLabelAnchorDragMove()`, `stopLabelAnchorDrag()`
  Ini memungkinkan label dipindahkan saat mode edit diaktifkan.

- `getLabelAnchorPosition()`
  Menghitung posisi label berdasarkan ukuran model dan offset konfigurasi.

- `getPiliHairAnchorPosition()`
  Ini logika khusus untuk pili, karena bentuknya rumit. Fungsi ini mencari titik yang lebih cocok di bagian rambut luar agar label tidak menempel di lokasi yang aneh.

- `createLabels()`
  Membuat elemen HTML label, memberi warna, teks, event klik, dan menaruhnya ke dunia 3D melalui `CSS2DObject`.

Saat label diklik kiri:

- popup muncul
- kamera terbang mendekat ke organel

Saat klik kanan dan mode edit aktif:

- label bisa dituning
- settings panel bisa membuka bagian pengaturan label

Contoh kode pembuatan label:

```js
const el = document.createElement('div');
el.className = 'label3d';
el.innerHTML =
  `<span class="lnum">${o.num}</span>` +
  `<span class="lname">${o.icon} ${o.name}</span>`;

const css2d = new CSS2DObject(el);
css2d.position.copy(pos);
scene.add(css2d);
```

Jadi label bukan teks yang digambar langsung di model, tetapi elemen HTML yang ditempel pada posisi 3D tertentu.

#### N. Occlusion label

Masalah umum pada label 3D adalah label bisa tertutup objek.

Di proyek ini, ada sistem raycasting untuk mendeteksi apakah ada mesh yang menghalangi garis pandang kamera ke label.

Fungsi pentingnya:

- `rebuildMeshCache()`
  Menyimpan daftar mesh untuk dicek.

- `restoreOccluderOpacity()`
  Mengembalikan opacity material yang tadi dibuat transparan.

- `fadeOccluder()`
  Membuat objek penghalang jadi lebih transparan.

- `updateLabelOcclusion()`
  Mengecek tiap label dan memudarkan objek yang menghalangi.

Efek akhirnya: label tetap mudah dibaca walaupun model 3D kompleks.

#### O. Animasi kamera `flyToOrganelle()`

Saat pengguna fokus ke organel tertentu, kamera tidak langsung “teleport”.
Kamera bergerak halus menuju target.

Fungsi ini menghitung:

- posisi awal kamera
- target akhir kamera
- durasi animasi
- easing agar gerak terasa halus

Ini membuat viewer terasa lebih modern dan nyaman dilihat.

Contoh kode animasi kamera:

```js
function flyToOrganelle(targetPos) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();

  function step() {
    camera.position.lerpVectors(startPos, camDest, ease);
    controls.target.lerpVectors(startTarget, targetPos, ease);
    controls.update();
  }
}
```

Maknanya: kamera berpindah sedikit demi sedikit, bukan langsung loncat.

#### P. Info popup

Fungsi `showInfo(o)` mengambil data dari objek organel lalu mengisi popup:

- warna accent
- ikon
- nomor
- nama
- subjudul
- deskripsi
- list fakta

Sedangkan `closeInfo()` hanya menyembunyikan popup.

Contoh kode popup:

```js
function showInfo(o) {
  document.getElementById('popup-icon').textContent = o.icon;
  document.getElementById('popup-name').textContent = o.name;
  document.getElementById('popup-sub').textContent = o.sub;
  document.getElementById('popup-desc').textContent = o.desc;
  document.getElementById('popup-detail').innerHTML =
    o.detail.map(d => '<li>' + d + '</li>').join('');
}
```

Terlihat jelas bahwa popup diisi dari data organel, bukan ditulis manual satu-satu untuk setiap klik.

#### Q. Toolbar dan settings panel

Fungsi-fungsi berikut mengurus interaksi antarmuka:

- `toggleLabels()`
  Menampilkan atau menyembunyikan label.

- `toggleSettings()`
  Membuka atau menutup panel pengaturan.

- `setSettingsPanelOpen()`
  Memaksa panel ke kondisi terbuka atau tertutup.

- `resetCamera()`
  Mengembalikan kamera ke posisi awal.

- `focusOrganelle(num)`
  Mencari organel berdasarkan nomor dan mengarahkan kamera ke sana.

- `setAmbient(v)`
  Mengatur intensitas cahaya lingkungan.

- `setDirectional(v)`
  Mengatur cahaya utama.

- `setEnv(v)`
  Mengatur exposure / terang keseluruhan.

- `toggleLayer(id)`
  Menyembunyikan atau menampilkan bagian model tertentu.

Contoh kode toggle layer:

```js
function toggleLayer(id) {
  if (meshMap[id] === undefined) return;
  layerVisible[id] = !layerVisible[id];
  if (meshMap[id]) meshMap[id].visible = layerVisible[id];
  syncLabelVisibility();
}
```

Artinya saat sebuah layer dimatikan, modelnya hilang dari scene dan labelnya ikut disesuaikan.

#### R. Label tuning UI

Ini fitur lanjutan yang sangat berguna untuk pengembang.

Kalau `labelEditable` aktif, panel settings akan menambahkan bagian khusus untuk mengedit posisi label.

Fungsi penting:

- `updateLabelTuneUI()`
  Menyinkronkan tampilan slider dengan model yang sedang dipilih.

- `applyAxisFromSlider()`
  Mengubah nilai X, Y, Z dari slider.

- `syncLabelTuningAvailability()`
  Menentukan apakah panel label tuning perlu ditampilkan.

- `buildLabelTuneSection()`
  Membangun seluruh UI label tuning secara dinamis lewat JavaScript.

UI ini memungkinkan:

- pilih model target
- geser offset X/Y/Z
- tampilkan garis bantu
- simpan ke browser
- download `conf.json`
- upload `conf.json`

Artinya proyek ini bukan cuma viewer untuk pengguna akhir, tetapi juga punya alat bantu kalibrasi untuk pembuatnya.

#### S. Membangun isi settings panel

Bagian ini otomatis membuat:

- daftar layer model
- tombol fokus organel

Jadi isi panel tidak ditulis satu-satu di HTML, tetapi dibangkitkan dari data `MODELS` dan `ORGANELLES`.

Keuntungan pendekatan ini:

- lebih hemat penulisan kode
- lebih mudah dirawat
- jika data model bertambah, UI bisa ikut menyesuaikan

#### T. Resize

Fungsi `resize()` memastikan ukuran canvas dan kamera menyesuaikan ukuran layar.

Tanpa ini, model bisa tampak gepeng, terpotong, atau tidak proporsional saat jendela browser diubah ukurannya.

#### U. Animation loop

Fungsi `animate()` dipanggil terus-menerus memakai `requestAnimationFrame`.

Tapi proyek ini cukup efisien karena render utama dilakukan saat `needsRender` bernilai `true`.

Artinya, sistem berusaha tidak menggambar ulang tanpa alasan. Ini membantu performa.

Selain itu, `setInterval()` dipakai untuk mengecek occlusion label secara berkala.

#### V. Event listener terakhir

Di bagian paling bawah ada beberapa event penting:

- klik canvas untuk menutup panel settings
- `pointermove`, `pointerup`, `pointercancel` untuk drag label tuning
- `Object.assign(window, { ... })` supaya fungsi JavaScript bisa dipanggil dari atribut `onclick` di HTML

Ini menjembatani HTML dan JavaScript.

Contoh kode expose function ke HTML:

```js
Object.assign(window, {
  toggleLabels,
  toggleSettings,
  resetCamera,
  focusOrganelle,
  closeInfo
});
```

Tujuannya agar tombol HTML yang memakai `onclick` bisa memanggil fungsi yang ada di `script.js`.

---

### `conf.json` — Posisi Label

File ini menyimpan konfigurasi posisi label.

Contoh isinya:

```json
{
  "labelEditable": 0,
  "showGuideLines": false,
  "anchorsByModelId": {
    "0": [0.2, 0.35, 0.3]
  }
}
```

Penjelasan tiap bagian:

- `labelEditable`
  `0` berarti mode edit label dimatikan, `1` berarti dihidupkan.

- `showGuideLines`
  Menentukan apakah garis bantu posisi label ditampilkan.

- `guideLineColor`
  Warna garis bantu.

- `fallbackAnchor`
  Posisi default jika model belum punya anchor khusus.

- `anchorsByModelId`
  Offset label untuk tiap model.

- `updatedAt`
  Waktu terakhir konfigurasi disimpan.

Secara sederhana, file ini adalah “pengingat posisi label” untuk viewer 3D.

Contoh kode asli `conf.json`:

```json
{
  "version": 1,
  "labelEditable": 0,
  "showGuideLines": false,
  "guideLineColor": 2282478,
  "fallbackAnchor": [0.15, 0.35, 0.15],
  "anchorsByModelId": {
    "0": [0.2, 0.35, 0.3],
    "1": [-0.2, 0.28, 0.3],
    "2": [0.028399963378906212, 0.17680001831054687, -0.35]
  }
}
```

Nilai desimal ini memang wajar, karena posisi label sering berasal dari hasil tuning manual yang cukup presisi.

---

### `start-server.bat` — Menjalankan Server Lokal

File ini dibuat untuk pengguna Windows agar tidak perlu mengetik command manual.

Urutannya:

1. Coba cek apakah `python` tersedia.
2. Jika ada, jalankan `python -m http.server 8000`.
3. Jika tidak ada, coba `python3`.
4. Jika masih tidak ada, coba `npx serve` dari Node.js.
5. Jika semua tidak ada, tampilkan pesan error.

Kenapa perlu server lokal?

Karena browser biasanya membatasi pemuatan file module dan file 3D jika halaman dibuka langsung lewat `file://`.

Jadi file `.bat` ini bukan bagian tampilan website, tetapi alat bantu saat development.

Catatan kecil: judul di file ini masih bertuliskan `3D Plant Cell - Local Server`, jadi itu kemungkinan sisa dari proyek atau nama lama.

Contoh kode `start-server.bat`:

```bat
python --version >nul 2>&1
IF %ERRORLEVEL% == 0 (
  echo Menjalankan server dengan Python...
  python -m http.server 8000
  goto :end
)
```

Kode ini artinya: kalau Python ada, langsung pakai Python sebagai server lokal.

---

### `index_old_viewer.html` — Viewer Lama / Arsip

File ini tampaknya adalah versi viewer sebelumnya, sebelum logika dipindahkan ke kombinasi `viewer.html + script.js + style.css` yang sekarang.

Manfaat file ini biasanya:

- sebagai backup
- sebagai referensi desain lama
- sebagai tempat melihat eksperimen sebelumnya

Untuk aplikasi aktif sekarang, file ini bukan pusat utama.

---

## 5. Alur Kerja Aplikasi dari Awal Sampai Bisa Dipakai

Supaya mudah menjelaskannya ke orang yang belum pernah ngoding, ini alur lengkapnya.

### Saat membuka `index.html`

1. Browser membaca struktur halaman.
2. `style.css` memberi tampilan dan animasi.
3. Script kecil navbar mengatur menu mobile.
4. Pengguna bisa memilih masuk ke halaman materi atau viewer.

### Saat membuka `info.html`

1. Browser menampilkan daftar kartu organel.
2. CSS menyembunyikan detail tambahan secara default.
3. Saat kartu diklik, class `expanded` ditoggle.
4. Detail dan fakta seru muncul.

### Saat membuka `viewer.html`

1. Browser menampilkan area viewer, popup, hint, dan panel settings.
2. Browser memuat library Three.js dari CDN.
3. `script.js` dijalankan.
4. JavaScript membuat scene, camera, renderer, lights, dan controls.
5. JavaScript membaca `conf.json` dan localStorage untuk posisi label.
6. Semua model `.obj` dimuat satu per satu.
7. Progress loading diperbarui.
8. Setelah selesai, kamera diposisikan otomatis ke sudut terbaik.
9. Label 3D dibuat dan ditempelkan ke posisi masing-masing organel.
10. Pengguna mulai bisa berinteraksi:
    klik label, ubah cahaya, fokus ke organel, reset kamera, dan lain-lain.

---

## 6. Kenapa Kode Ini Sudah Cukup Bagus

Ada beberapa keputusan teknis yang cukup kuat di proyek ini:

- Data organel dipisah dari logika render, jadi lebih mudah dirawat.
- Viewer menyesuaikan performa desktop dan mobile.
- Label punya sistem occlusion, jadi pengalaman pakai lebih nyaman.
- Panel settings dibangun dari data, bukan ditulis manual semua.
- Posisi label bisa disimpan ke browser atau file JSON.
- Teks label memakai CSS2D sehingga tampil lebih jelas.

Artinya, kode ini bukan sekadar “bisa jalan”, tetapi sudah memikirkan pengalaman pengguna dan kemudahan pengembangan.

---

## 7. Hal yang Perlu Diketahui Kalau Mau Menjelaskan ke Orang Non-Programmer

Kalimat penjelasan yang aman dipakai:

- “HTML menyusun isi halaman.”
- “CSS mengatur tampilan dan animasi.”
- “JavaScript mengatur perilaku dan interaksi.”
- “Three.js dipakai untuk menggambar model 3D di browser.”
- “Model bakteri tidak digambar manual di kode, tetapi dimuat dari file `.obj`.”
- “Label organel adalah elemen HTML yang diposisikan mengikuti objek 3D.”
- “`conf.json` dipakai untuk menyimpan posisi label agar tetap pas.”

Kalimat yang bisa dipakai untuk menjelaskan `script.js` dengan singkat:

> File `script.js` adalah pusat kendali viewer 3D. Ia memuat model bakteri, memberi warna dan pencahayaan, membuat label, membuka popup informasi, menggerakkan kamera, dan mengatur semua interaksi pengguna.

---

## 8. Ringkasan Singkat Per File

Kalau kamu butuh versi super-singkat saat presentasi:

- `index.html` = halaman depan
- `info.html` = halaman teori / materi organel
- `viewer.html` = kerangka viewer 3D
- `style.css` = semua tampilan visual
- `script.js` = logika utama viewer 3D
- `conf.json` = posisi label 3D
- `start-server.bat` = alat bantu menjalankan server lokal
- `index_old_viewer.html` = versi lama / arsip

---

## 9. Teknologi yang Dipakai

| Teknologi | Fungsi Sederhana |
|-----------|------------------|
| HTML | Menyusun isi halaman |
| CSS | Mengatur warna, layout, animasi |
| JavaScript | Mengatur interaksi dan logika |
| Three.js | Engine 3D di browser |
| OBJLoader | Membaca file model `.obj` |
| CSS2DRenderer | Menampilkan label HTML di dunia 3D |
| OrbitControls | Mengatur putar/zoom kamera |
| EffectComposer | Efek visual tambahan |
| localStorage | Menyimpan pengaturan label di browser |

---

## 10. Kesimpulan

InsideBacteria adalah proyek web edukasi yang menggabungkan:

- halaman informasi biasa
- desain visual sci-fi
- viewer 3D interaktif
- sistem label yang bisa dikonfigurasi

Secara struktur, proyek ini cukup jelas:

- HTML menyusun halaman
- CSS mempercantik tampilan
- JavaScript menjalankan viewer 3D dan interaksinya

Bagian paling kompleks ada di `script.js`, karena file itu menangani hampir seluruh sistem viewer: loading model, kamera, cahaya, label, popup, pengaturan, dan animasi.

Kalau ingin menjelaskan proyek ini ke orang yang belum pernah ngoding, fokus terbaiknya adalah:

1. jelaskan peran tiap file
2. jelaskan alur saat pengguna membuka viewer
3. jelaskan bahwa Three.js dipakai sebagai mesin 3D
4. jelaskan bahwa data biologis dan data visual dipisah agar rapi

---

## 11. Cara Menjalankan Proyek

### Opsi 1 — Live Server di VS Code

1. Install ekstensi Live Server.
2. Klik kanan `index.html`.
3. Pilih **Open with Live Server**.

### Opsi 2 — Python

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

### Opsi 3 — File BAT Windows

Jalankan `start-server.bat`.

---

## 12. Lisensi

Proyek ini dibuat untuk kebutuhan pembelajaran biologi interaktif.
