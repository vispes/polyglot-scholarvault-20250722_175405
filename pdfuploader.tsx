const FILE_SIZE_LIMIT_MB = 10;

interface PDFUploaderProps {
  onFileSelected: (file: File) => void;
}

function PDFUploader({ onFileSelected }: PDFUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useRef(`pdf-upload-error-${Math.random().toString(36).substring(2, 11)}`);

  const validateFile = (file: File): string | null => {
    const isPDF = file.type === 'application/pdf' || 
                 file.name.toLowerCase().endsWith('.pdf');
    
    if (!isPDF) {
      return 'Please select a valid PDF file.';
    }

    if (file.size > FILE_SIZE_LIMIT_MB * 1024 * 1024) {
      return `File size exceeds ${FILE_SIZE_LIMIT_MB}MB limit.`;
    }

    return null;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setError(null);

    if (!files || files.length === 0) {
      setError('No file selected.');
      return;
    }

    const file = files[0];
    const validationError = validateFile(file);
    
    if (!validationError) {
      onFileSelected(file);
    } else {
      setError(validationError);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        accept="application/pdf"
        onChange={handleFileUpload}
        aria-invalid={!!error}
        aria-describedby={error ? errorId.current : undefined}
      />
      {error && (
        <div 
          id={errorId.current} 
          role="alert"
          style={{ color: 'red', marginTop: 8 }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default PDFUploader;