export default function App() {
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pdfFile) {
            setPageImages([]);
            return;
        }
        
        const processPdf = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const images = await convertPdfToImages(pdfFile);
                setPageImages(images);
                setCurrentPage(0);
            } catch (err) {
                console.error("PDF processing error:", err);
                setError(`Failed to process PDF: ${err.message}`);
            } finally {
                setIsProcessing(false);
            }
        };

        processPdf();
    }, [pdfFile]);

    const handleReset = () => {
        if (confirm('Start over? All edits will be lost.')) {
            setPdfFile(null);
            setPageImages([]);
            setError(null);
        }
    };

    return (
        <div className="app-container">
            {error ? (
                <div className="error-screen">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <div className="button-group">
                        <button onClick={() => setError(null)}>Retry</button>
                        <button onClick={handleReset}>Start Over</button>
                    </div>
                </div>
            ) : !currentLanguage ? (
                <LanguageSelector onSelect={setCurrentLanguage} />
            ) : !pdfFile ? (
                <PDFUploader onFileUpload={setPdfFile} currentLanguage={currentLanguage} />
            ) : isProcessing ? (
                <div className="processing-indicator">
                    <div className="spinner" role="status" aria-label="Processing"></div>
                    <p>Processing PDF file...</p>
                </div>
            ) : (
                <PageEditor 
                    pages={pageImages} 
                    currentPage={currentPage} 
                    onPageChange={setCurrentPage} 
                    onReset={handleReset}
                    currentLanguage={currentLanguage}
                />
            )}
        </div>
    );
}

// Mock PDF conversion function
const convertPdfToImages = async (pdfFile) => {
    return new Promise((resolve, reject) => {
        if (!pdfFile) {
            reject(new Error('No PDF file provided'));
            return;
        }

        setTimeout(() => {
            try {
                const mockPageCount = Math.min(9, Math.max(1, Math.floor(Math.random() * 10)));
                const images = Array.from({ length: mockPageCount }, (_, i) => 
                    `data:image/svg+xml;base64,${btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" viewBox="0 0 595 842">
                            <rect fill="#f0f4f8" width="100%" height="100%" />
                            <rect fill="#d8f7ed" width="80%" height="20" x="10%" y="100" rx="4" />
                            <rect fill="#ff9f7e" width="60%" height="20" x="20%" y="180" rx="4" />
                            <rect fill="#fde68a" width="70%" height="20" x="15%" y="260" rx="4" />
                            <text x="50%" y="350" text-anchor="middle" font-size="24" fill="#1e293b">${pdfFile.name}</text>
                            <text x="50%" y="400" text-anchor="middle" font-size="18" fill="#475569">Page ${i+1}/${mockPageCount}</text>
                        </svg>
                    `)}`
                );
                resolve(images);
            } catch (err) {
                reject(new Error(`Mock conversion failed: ${err.message}`));
            }
        }, 2500);
    });
};