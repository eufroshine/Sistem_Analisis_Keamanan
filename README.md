# Sistem Analisis Keamanan Real-time dengan WebSocket dan WebAssembly

| Nama               | NIM          |
|--------------------|--------------|
| Abidzar Sabil Handoyo | 312310471   |

## 📝 Deskripsi

Sistem ini menyediakan platform analisis keamanan real-time dengan menggabungkan teknologi WebSocket untuk komunikasi dua arah dan WebAssembly untuk pemrosesan data performa tinggi.

Proyek ini merupakan implementasi dari artikel yang saya tulis di Medium berjudul [Membangun Sistem Analisis Keamanan Real-time: Menggabungkan WebSocket dan WebAssembly untuk Pemantauan Keamanan yang Lebih Efisien](https://medium.com/@abidzarsabil05/membangun-sistem-analisis-keamanan-real-time-menggabungkan-websocket-dan-webassembly-untuk-3e113925ed23).

> **Catatan**: Saat ini sistem menggunakan data dummy (simulasi) untuk demonstrasi konsep. Instruksi untuk mengintegrasikannya dengan data keamanan sebenarnya disediakan di bagian "Catatan Implementasi".

## 🚀 Fitur Utama

- **Komunikasi real-time** menggunakan WebSocket
- **Analisis serangan performa tinggi** dengan WebAssembly
- **Dashboard interaktif** untuk monitoring serangan
- **Filter dan visualisasi serangan** dengan berbagai jenis chart
- **Simulasi serangan** untuk pengujian
- **Pemantauan Real-time**: Melacak dan menampilkan serangan keamanan secara instan
- **Analisis Berbasis WebAssembly**: Memanfaatkan performa tinggi dari WebAssembly untuk analisis serangan
- **Multi-bahasa**: Antarmuka tersedia dalam Bahasa Indonesia
- **Rekomendasi Respons**: Memberikan saran tindakan berdasarkan analisis serangan

## 🔧 Komponen Sistem

Sistem ini terdiri dari beberapa komponen utama:

1. **Frontend**: Antarmuka pengguna berbasis web untuk menampilkan data keamanan
2. **Backend WebSocket**: Server untuk komunikasi real-time
3. **Modul WebAssembly**: Modul analisis keamanan berkecepatan tinggi
4. **Dashboard**: Visualisasi data dan log serangan

## 🛠️ Teknologi yang Digunakan

- WebSocket (ws)
- WebAssembly (WASM)
- Node.js
- Chart.js
- HTML/CSS/JavaScript Vanilla

## ⚙️ Cara Menginstal dan Menjalankan

### Prasyarat

- Node.js dan npm
- Browser web modern dengan dukungan WebSocket dan WebAssembly

### Langkah-langkah

1. Clone repository ini
```bash
git clone https://github.com/eufroshine/Sistem_Analisis_Keamanan.git
cd Sistem_Analisis_Keamanan
```

2. Install dependencies
```bash
npm install
```

3. Kompilasi file WebAssembly
```bash
# Menggunakan wabt (WebAssembly Binary Toolkit)
wat2wasm security_analysis.wat -o security_analysis.wasm

# ATAU gunakan wat-wasm jika menggunakan Node.js
npm install -g wat-wasm
wat-wasm security_analysis.wat -o security_analysis.wasm
```

4. Jalankan server
```bash
node server.js
```

5. Buka aplikasi di browser
```
http://localhost:8080
```

## 📂 Struktur File

- **index.html**: Halaman utama aplikasi
- **styles.css**: Styling untuk antarmuka
- **app.js**: Logika utama aplikasi
- **websocket.js**: Menangani koneksi WebSocket
- **wasm-module.js**: Integrasi dengan modul WebAssembly
- **security_analysis.wat**: Kode WebAssembly dalam format Text
- **server.js**: Server WebSocket untuk komunikasi real-time

## 📊 Dokumentasi

### Screenshots

[Tambahkan screenshot aplikasi di sini]

### Diagram Arsitektur

[Tambahkan diagram arsitektur sistem di sini]

### Demo Video

[Tambahkan link ke video demo di sini]

## 📝 Artikel Terkait

Untuk penjelasan lebih detail tentang implementasi dan konsep di balik sistem ini, silakan baca artikel Medium saya:
- [Membangun Sistem Analisis Keamanan Real-time: Menggabungkan WebSocket dan WebAssembly untuk Pemantauan Keamanan yang Lebih Efisien](https://medium.com/@abidzarsabil05/membangun-sistem-analisis-keamanan-real-time-menggabungkan-websocket-dan-webassembly-untuk-3e113925ed23)

## 💻 Catatan Implementasi

Sistem ini saat ini menggunakan data simulasi (dummy) untuk mendemonstrasikan konsep integrasi WebSocket dan WebAssembly. Untuk mengimplementasikan dengan data keamanan sebenarnya:

### Integrasi WebAssembly

File `wasm-module.js` saat ini mensimulasikan fungsi WebAssembly. Untuk menggunakan WebAssembly sesungguhnya:

1. Kompilasi file `security_analysis.wat` ke format `.wasm` menggunakan instruksi di bagian instalasi.
2. Ganti fungsi `init()` dan `analyzeAttack()` di `wasm-module.js` dengan kode berikut:

```javascript
// Initialize the WASM module
async init() {
    try {
        if (this.ready) return Promise.resolve(true);
        
        // Import object untuk fungsi yang dibutuhkan oleh WebAssembly
        const importObject = {
            env: {
                memory: new WebAssembly.Memory({ initial: 1 }),
                consoleLog: (offset, length) => {
                    const bytes = new Uint8Array(this.memory.buffer, offset, length);
                    const message = new TextDecoder('utf8').decode(bytes);
                    console.log(message);
                }
            }
        };
        
        // Load dan instantiate module
        const response = await fetch('security_analysis.wasm');
        const wasmBytes = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(wasmBytes, importObject);
        
        this.instance = wasmModule.instance;
        this.module = wasmModule.module;
        this.exports = this.instance.exports;
        this.memory = importObject.env.memory;
        
        console.log('WebAssembly module initialized');
        this.ready = true;
        return true;
    } catch (error) {
        console.error('Failed to initialize WebAssembly module:', error);
        return false;
    }
}

// Analyze an attack using the WASM module
async analyzeAttack(attackData) {
    await this.init();
    
    // Map attack type to integer
    const attackTypeMap = {
        'sql': 1,
        'xss': 2,
        'dos': 3,
        'brute': 4,
        'csrf': 5,
        'file': 6,
        'command': 7,
        'other': 0
    };
    
    // Map severity to integer
    const severityMap = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'critical': 4
    };
    
    // Generate bitmap for pattern matching (atau dapatkan dari analisis real)
    const patternMatches = (Math.random() > 0.7 ? 1 : 0) | // Known TOR exit node
                          (Math.random() > 0.8 ? 2 : 0) | // Previously flagged IP
                          (Math.random() > 0.5 ? 4 : 0) | // Signature matching
                          (Math.random() > 0.6 ? 8 : 0);  // Behavioral anomaly
    
    // Call the WebAssembly function
    const attackType = attackTypeMap[attackData.type] || 0;
    const severity = severityMap[attackData.severity] || 1;
    const threatScore = this.exports.analyzeAttack(attackType, severity, patternMatches);
    
    // Patterns that were detected
    const detectedPatterns = [];
    if (patternMatches & 1) detectedPatterns.push({ name: 'Known TOR exit node', detected: true });
    if (patternMatches & 2) detectedPatterns.push({ name: 'Previously flagged IP', detected: true });
    if (patternMatches & 4) detectedPatterns.push({ name: 'Signature matching', detected: true });
    if (patternMatches & 8) detectedPatterns.push({ name: 'Behavioral anomaly', detected: true });
    
    // Generate recommendations based on analysis
    const recommendations = this._generateRecommendations(attackData, threatScore);
    
    return {
        threatScore: threatScore,
        patterns: detectedPatterns,
        timestamp: new Date().getTime(),
        recommendations,
        confidence: Math.min(100, 50 + Math.floor(Math.random() * 50))
    };
}
```

### Integrasi Data Nyata

Untuk memasukkan data serangan keamanan nyata:

1. Modifikasi `server.js` untuk terhubung ke sumber data keamanan nyata (misalnya IDS, firewall logs, dll.)
2. Sesuaikan struktur pesan WebSocket dengan format data keamanan Anda
3. Terapkan logika deteksi pola nyata dalam file WebAssembly atau dalam modul JavaScript terpisah

## 🔮 Pengembangan Lebih Lanjut

Sistem ini adalah versi dasar yang dapat dikembangkan lebih lanjut dengan:

1. Integrasi dengan sumber log keamanan nyata
2. Pengembangan algoritma analisis ancaman yang lebih canggih
3. Penambahan fitur notifikasi dan peringatan
4. Implementasi machine learning untuk deteksi anomali
5. Penambahan visualisasi data yang lebih kompleks

## 🔒 Penggunaan dalam Produksi

Untuk penggunaan dalam lingkungan produksi, pertimbangkan untuk:

1. Menambahkan autentikasi dan otorisasi
2. Mengimplementasikan enkripsi untuk komunikasi WebSocket (WSS)
3. Meningkatkan ketahanan dan kemampuan pemulihan server
4. Menambahkan kemampuan penyimpanan dan analisis historis
5. Mengintegrasikan dengan sistem keamanan yang ada

## 📜 Lisensi

[MIT License](LICENSE)

## 📞 Kontak

Jika Anda memiliki pertanyaan atau ingin berkolaborasi, silakan hubungi saya melalui:
- Email: abidzarsabil03@gmail.com
- LinkedIn: [Abidzar Sabil](https://www.linkedin.com/in/abidzar-sabil-21a406305/)
