import { GoogleGenAI } from "@google/genai";
import { RPPFormData } from "../types";

export const generateRPPContent = async (formData: RPPFormData): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Tentukan Model Pembelajaran: Gunakan input user jika ada, jika tidak minta AI tentukan
  const modelPembelajaranInstruction = formData.modelPembelajaran 
    ? `Gunakan Model Pembelajaran: ${formData.modelPembelajaran}` 
    : "Pilih Model Pembelajaran yang paling sesuai dengan materi (misal: PBL, PjBL, Discovery Learning).";

  const prompt = `
Anda adalah AI PENDIDIK PROFESIONAL.

TUGAS ANDA:
Susun MODUL AJAR LENGKAP.
PENTING:
1. JANGAN gunakan kalimat pembuka seperti "Berikut adalah modul ajar...". Langsung mulai dengan JUDUL MODUL.
2. Gunakan format Markdown standar.
3. Judul Utama dan Sub-Bab harus dicetak **TEBAL** (Bold).
4. Bagian "Desain Pembelajaran" WAJIB disajikan dalam bentuk TABEL.
5. Gunakan penomoran ROMAWI (I, II, III, dst) untuk setiap Sub-Bab Utama (H2).
6. Bagian "Langkah Pembelajaran" WAJIB disajikan dalam bentuk TABEL. 
   **INSTRUKSI KHUSUS KEGIATAN INTI (Sangat Penting):**
   - **Model Pembelajaran:** ${modelPembelajaranInstruction}
   - **Tabel Langkah Pembelajaran:**
     - **Kolom 1 (Sintaks/Fase):** Tuliskan HANYA Sintaks/Fase dari model pembelajaran yang digunakan.
     - **Kolom 2 & 3 (Aktivitas):** Integrasikan tahapan Deep Learning (**Memahami**, **Mengaplikasi**, **Merefleksi**) ke dalam deskripsi kegiatan Guru dan Siswa.
     - **Cara Menulis Deep Learning:** Jangan buat kolom terpisah. Sisipkan label tebal seperti **[Memahami]**, **[Mengaplikasi]**, atau **[Merefleksi]** di awal kalimat deskripsi kegiatan yang relevan di dalam kolom Aktivitas.

DATA INPUT:
Nama Penyusun: ${formData.nama}
Mata Pelajaran: ${formData.mapel}
Kelas/Fase: ${formData.kelas}
Semester: ${formData.semester}
Topik/Materi: ${formData.topik}
Alokasi Waktu: ${formData.alokasi}
Capaian Pembelajaran (CP): ${formData.cp}
${formData.modelPembelajaran ? `Model Pembelajaran Diminta: ${formData.modelPembelajaran}` : ''}

STRUKTUR OUTPUT YANG DIINGINKAN (Ikuti format ini persis):

# MODUL AJAR ${formData.mapel.toUpperCase()}
## I. INFORMASI UMUM

| Komponen | Keterangan |
| :--- | :--- |
| Penyusun | ${formData.nama} |
| Satuan Pendidikan | SMPN 1 CIGASONG |
| Tahun Penyusunan | 2026 |
| Jenjang Sekolah | SMP |
| Kelas / Fase | ${formData.kelas} |
| Semester | ${formData.semester} |
| Materi Pokok | ${formData.topik} |
| Alokasi Waktu | ${formData.alokasi} |

## II. DESAIN PEMBELAJARAN
(Sajikan bagian ini dalam bentuk Tabel)

| Komponen Desain | Uraian |
| :--- | :--- |
| **1. Capaian Pembelajaran (CP)** | ${formData.cp} |
| **2. Tujuan Pembelajaran (TP)** | (Turunkan TP yang spesifik dan terukur dari CP diatas) |
| **3. Alur Tujuan Pembelajaran (ATP)** | (Susun ATP yang logis) |
| **4. Materi Pembelajaran** | (Rincian materi ajar) |
| **5. Model Pembelajaran** | ${formData.modelPembelajaran ? formData.modelPembelajaran : "(AI menentukan model yang sesuai)"} |
| **6. Pendekatan** | **Deep Learning** |
| **7. Strategi** | (Strategi pembelajaran) |
| **8. Metode** | (Diskusi, penugasan, dll) |
| **9. Kemitraan** | (Pihak yang terlibat) |
| **10. Lintas Disiplin** | (Koneksi dengan mapel lain) |

## III. DIMENSI PROFIL LULUSAN
Dari 8 Dimensi Profil Lulusan berikut:
1. Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa
2. Kewargaan
3. Penalaran Kritis
4. Kreativitas
5. Kolaborasi
6. Kemandirian
7. Kesehatan
8. Komunikasi

Pilih dimensi yang SANGAT RELEVAN dengan Tujuan Pembelajaran dan Materi ini. Jelaskan bagaimana dimensi tersebut diintegrasikan dalam pembelajaran. (Tidak perlu mencantumkan semua, cukup pilih yang relevan).

## IV. PEMBELAJARAN BERDIFERENSIASI
* **Diferensiasi Konten:** (Jelaskan strategi)
* **Diferensiasi Proses:** (Jelaskan strategi)
* **Diferensiasi Produk:** (Jelaskan strategi)

## V. KOMPETENSI AWAL
* (Pengetahuan prasyarat)
* (Kesiapan belajar)

## VI. SARANA DAN PRASARANA
* Media & Alat: ...
* Sumber Belajar: ...

## VII. LANGKAH PEMBELAJARAN
(Sajikan dalam bentuk Tabel.)

| Tahap / Sintaks Model | Deskripsi Kegiatan Guru | Deskripsi Kegiatan Siswa | Alokasi Waktu |
| :--- | :--- | :--- | :--- |
| **Pendahuluan** | (Salam, Apersepsi, Motivasi, Tujuan) | (Berdoa, Menyimak, dll) | ... |
| **Kegiatan Inti** | | | |
| [Nama Sintaks Model 1] | **[Memahami]** [Aktivitas guru...]<br>**[Mengaplikasi]** [Aktivitas guru...] | [Aktivitas siswa...] | ... |
| [Nama Sintaks Model 2] | [Aktivitas guru...] | **[Mengaplikasi]** [Aktivitas siswa mengerjakan tugas...] | ... |
| [Nama Sintaks Model 3] | [Aktivitas guru...] | **[Merefleksi]** [Aktivitas siswa...] | ... |
| *(Lanjutkan hingga semua sintaks model tercakup & pastikan tag Memahami, Mengaplikasi, Merefleksi tersebar sesuai konteks)* | ... | ... | ... |
| **Penutup** | (Refleksi, Kesimpulan, Tindak Lanjut) | (Refleksi, Mencatat) | ... |

## VIII. ASESMEN PEMBELAJARAN
1. **Asesmen Diagnostik:** ...
2. **Asesmen Formatif:** ...
3. **Asesmen Sumatif:** ...
(Sertakan Rubrik Penilaian singkat dalam bentuk Tabel jika memungkinkan)

## IX. LEMBAR KERJA PESERTA DIDIK (LKPD)
Buatlah LKPD yang **SIAP CETAK** dan **DETAIL** untuk siswa. Jangan hanya deskripsi singkat. Format LKPD harus berisi:
1. **Judul Aktivitas/Tugas**
2. **Identitas:** (Kolom untuk Nama Kelompok/Siswa, Kelas, Tanggal)
3. **Tujuan Aktivitas**
4. **Alat dan Bahan**
5. **Langkah Kerja:** (Instruksi step-by-step yang jelas bagi siswa)
6. **Pertanyaan/Tugas:** (Berikan soal-soal spesifik atau tabel pengamatan yang harus diisi siswa. **Sediakan area/garis kosong** agar siswa bisa langsung menulis jawabannya di kertas ini).

## X. PENGAYAAN DAN REMEDIAL
* **Pengayaan:** ...
* **Remedial:** ...

## XI. REFLEKSI
* **Refleksi Guru:** ...
* **Refleksi Siswa:** ...
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    
    return response.text || "Gagal menghasilkan konten.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Terjadi kesalahan saat menghubungi Google Gemini API.");
  }
};