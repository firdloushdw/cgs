export const downloadWord = (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
  
    // CSS khusus untuk Microsoft Word
    // Menggunakan satuan 'pt' untuk border agar terdeteksi dengan baik oleh Word
    const css = `
        <style>
            @page {
                size: A4;
                margin: 2.54cm; /* Margin standar Word 1 inci */
            }
            body { 
                font-family: 'Times New Roman', Times, serif; 
                font-size: 12pt;
                line-height: 1.5;
            }
            /* Styling Typografi */
            h1 { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; margin-top: 14pt; margin-bottom: 12pt; }
            h2, h3 { font-size: 12pt; font-weight: bold; text-align: left; text-transform: uppercase; margin-top: 14pt; margin-bottom: 6pt; }
            h4, h5 { font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
            
            p { margin-bottom: 12pt; text-align: justify; }
            
            /* Styling Tabel KHUSUS untuk Word agar ada Border */
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 6pt; 
                margin-bottom: 12pt; 
                border: 1pt solid black;
            }
            
            th, td { 
                border: 1pt solid black !important; /* Force border 1pt solid */
                padding: 6pt; 
                vertical-align: top;
                text-align: left;
            }
            
            th { 
                background-color: #f0f0f0; 
                font-weight: bold; 
                text-align: center;
            }
            
            ul, ol { margin-left: 1cm; }
            li { margin-bottom: 6pt; }
        </style>
    `;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${fileName}</title>
        ${css}
      </head>
      <body>`;
    
    const footer = "</body></html>";
    const sourceHTML = header + element.innerHTML + footer;
  
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const downloadPDF = (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
  
    const opt = {
      margin: [15, 15, 15, 15], // Margin mm (Top, Left, Bottom, Right)
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      // Menghapus windowWidth agar html2canvas menyesuaikan dengan lebar konten A4
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
    };
  
    // Access global html2pdf from CDN
    if (window.html2pdf) {
        window.html2pdf().from(element).set(opt).save().catch((err: any) => {
            console.error("PDF generation failed:", err);
            alert("Gagal mendownload PDF. Silakan coba lagi.");
        });
    } else {
        alert("Library PDF belum siap, silakan tunggu atau refresh halaman.");
    }
  };

  export const copyToClipboard = async (elementId: string) => {
     const element = document.getElementById(elementId);
     if (!element) return;

     try {
         await navigator.clipboard.writeText(element.innerText);
         alert("Teks berhasil disalin!");
     } catch (err) {
         console.error("Gagal menyalin teks", err);
         alert("Gagal menyalin teks.");
     }
  };