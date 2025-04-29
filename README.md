| Nama               | NIM          |
|--------------------|--------------|
| Abidzar Sabil Handoyo        | 312310471   |

# Sistem Analisis Keamanan Real-time

Repository ini berisi implementasi dari Sistem Analisis Keamanan Real-time yang menggabungkan teknologi WebSocket dan WebAssembly untuk pemantauan keamanan yang lebih efisien dan cepat.

## 📝 Deskripsi

Proyek ini merupakan implementasi dari artikel yang saya tulis di Medium berjudul [Membangun Sistem Analisis Keamanan Real-time: Menggabungkan WebSocket dan WebAssembly untuk Pemantauan Keamanan yang Lebih Efisien](https://medium.com/@abidzarsabil05/membangun-sistem-analisis-keamanan-real-time-menggabungkan-websocket-dan-webassembly-untuk-3e113925ed23).

> **Catatan**: Saat ini sistem menggunakan data dummy (simulasi) untuk demonstrasi konsep. Instruksi untuk mengintegrasikannya dengan data keamanan sebenarnya disediakan di bagian "Catatan Implementasi".

Sistem ini dirancang untuk:
- Memantau serangan keamanan secara real-time
- Menganalisis berbagai jenis serangan (SQL Injection, XSS, DoS, dll.)
- Memberikan visualisasi data serangan
- Menggunakan WebAssembly untuk analisis yang cepat dan efisien
- Menerapkan WebSocket untuk komunikasi real-time

## 🚀 Fitur Utama

- **Pemantauan Real-time**: Melacak dan menampilkan serangan keamanan secara instan
- **Analisis Berbasis WebAssembly**: Memanfaatkan performa tinggi dari WebAssembly untuk analisis serangan
- **Visualisasi Data**: Chart dan statistik yang menampilkan tren serangan
- **Multi-bahasa**: Antarmuka tersedia dalam Bahasa Indonesia
- **Filter Log**: Memungkinkan penyaringan log berdasarkan jenis serangan dan tingkat keparahan
- **Rekomendasi Respons**: Memberikan saran tindakan berdasarkan analisis serangan

## 🛠️ Teknologi yang Digunakan

- WebSocket (ws)
- WebAssembly (WASM)
- Node.js
- Chart.js
- HTML/CSS/JavaScript Vanilla

## ⚙️ Cara Menginstal dan Menjalankan

1. Clone repository ini
```bash
git clone https://github.com/yourusername/security-analysis-realtime.git
cd security-analysis-realtime
```

2. Install dependencies
```bash
npm install
```

3. Kompilasi file WebAssembly (optional - saat ini menggunakan simulasi JavaScript)
```bash
# Menggunakan wabt (WebAssembly Binary Toolkit)
wat2wasm security_analysis.wat -o security_analysis.wasm

# ATAU gunakan wat-wasm jika menggunakan Node.js
npm install -g wat-wasm
wat-wasm security_analysis.wat -o security_analysis.wasm
```

4. Jalankan server
```bash
npm start
```

5. Buka browser dan akses `http://localhost:8080`

## 📊 Dokumentasi

[Bagian ini bisa diisi dengan dokumentasi tambahan, seperti screenshot, diagram, atau link ke dokumentasi eksternal]

### Screenshots

[Tambahkan screenshot aplikasi di sini]

### Diagram Arsitektur

[Tambahkan diagram arsitektur sistem di sini]

### Demo Video

[Tambahkan link ke video demo di sini]

## 📝 Artikel Terkait

Untuk penjelasan lebih detail tentang implementasi dan konsep di balik sistem ini, silakan baca artikel Medium saya:
- [Membangun Sistem Analisis Keamanan Real-time: Menggabungkan WebSocket dan WebAssembly untuk Pemantauan Keamanan yang Lebih Efisien](https://medium.com/@abidzarsabil05/membangun-sistem-analisis-keamanan-real-time-menggabungkan-websocket-dan-webassembly-untuk-3e113925ed23)

## 📜 Lisensi

[MIT License](LICENSE)

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

## 📞 Kontak

Jika Anda memiliki pertanyaan atau ingin berkolaborasi, silakan hubungi saya melalui:
- Email: [Email Anda]
- LinkedIn: [LinkedIn Anda]
