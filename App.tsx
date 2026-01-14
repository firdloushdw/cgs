import React, { useState, useRef } from 'react';
import InputForm from './components/InputForm';
import { RPPFormData } from './types';
import { generateRPPContent } from './services/geminiService';
import { downloadWord, downloadPDF, copyToClipboard } from './utils/exportUtils';

const App: React.FC = () => {
  const [formData, setFormData] = useState<RPPFormData>({
    nama: 'Dimas Anugrah Firdlous',
    mapel: 'Informatika',
    kelas: '',
    topik: '',
    cp: '',
    semester: '',
    alokasi: '',
    modelPembelajaran: '', // Inisialisasi kosong (opsional)
  });

  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult('');

    try {
      const generatedContent = await generateRPPContent(formData);
      // Use marked from global window object (loaded via CDN)
      if (window.marked) {
        setResult(window.marked.parse(generatedContent));
      } else {
        setResult(generatedContent); // Fallback to plain text if marked fails
      }
      
      // Auto scroll to results after a slight delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setLoading(false);
    }
  };

  // Signature component - Menggunakan TABLE agar rapi di Word
  const SignatureSection = () => (
    <div className="mt-8 pt-4 font-serif text-[12pt] break-inside-avoid">
        <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
            <tbody>
                <tr>
                    <td style={{ width: '40%', textAlign: 'center', verticalAlign: 'top', border: 'none', padding: '10px' }}>
                        <p style={{ margin: 0 }}>Mengetahui,</p>
                        <p style={{ margin: 0 }}>Kepala SMPN 1 CIGASONG</p>
                        <br /><br /><br /><br />
                        <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>Hj. Ai Nurmiati, S.Pd.,M.MPd.</p>
                        <p style={{ margin: 0 }}>NIP. 19710815 199412 2 002</p>
                    </td>
                    <td style={{ width: '20%', border: 'none' }}></td>
                    <td style={{ width: '40%', textAlign: 'center', verticalAlign: 'top', border: 'none', padding: '10px' }}>
                        <p style={{ margin: 0 }}>Cigasong, 2026</p>
                        <p style={{ margin: 0 }}>Guru Mata Pelajaran</p>
                        <br /><br /><br /><br />
                        <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>{formData.nama}</p>
                        <p style={{ margin: 0 }}>NIP. -</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-8 shadow-lg print:hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">RPP Generator NESACI</h1>
          <p className="text-blue-100 text-lg">Platform Penyusunan Modul Ajar Otomatis Berbasis AI</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="print:hidden">
            <InputForm 
            formData={formData} 
            onChange={handleInputChange} 
            onSubmit={handleSubmit} 
            isLoading={loading} 
            />
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm print:hidden" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        {result && (
          <div ref={resultsRef} className="animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                {/* Actions Toolbar */}
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-3 justify-end sticky top-0 z-10 print:hidden">
                    <button 
                        onClick={() => copyToClipboard('rpp-content')}
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        <span>Salin Teks</span>
                    </button>
                    <button 
                        onClick={() => downloadWord('rpp-content', `RPP_${formData.mapel}_${formData.kelas}`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span>Download Word</span>
                    </button>
                    <button 
                        onClick={() => downloadPDF('rpp-content', `RPP_${formData.mapel}_${formData.kelas}`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        <span>Download PDF</span>
                    </button>
                </div>

                {/* Content Area */}
                <div id="rpp-content" className="p-8 md:p-12 bg-white text-gray-800 leading-relaxed font-serif">
                    <div 
                        className="rpp-output prose prose-blue max-w-none"
                        dangerouslySetInnerHTML={{ __html: result }} 
                    />
                    <SignatureSection />
                </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center mt-auto print:hidden">
        <p>Made with ❤️ : Firdlous</p>
        <p className="text-sm mt-1">&copy; 2026 RPP Generator NESACI.</p>
      </footer>
    </div>
  );
};

export default App;