export interface RPPFormData {
  nama: string;
  mapel: string;
  kelas: string;
  topik: string;
  cp: string;
  semester: string;
  alokasi: string;
  modelPembelajaran?: string; // Field opsional baru
}

export interface GenerateRPPParams {
  formData: RPPFormData;
  apiKey: string;
}

// Global declaration for external libraries loaded via CDN
declare global {
  interface Window {
    html2pdf: any;
    marked: {
      parse: (text: string) => string;
    };
  }
}