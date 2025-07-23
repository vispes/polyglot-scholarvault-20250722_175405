const CitationConfigurator: React.FC<CitationConfiguratorProps> = ({ source }) => {
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('APA');
  const [citation, setCitation] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateCitation = (style: CitationStyle): string => {
    // Safely get author names
    const authorNames = source.authors?.map(author => author.name) || [];
    const year = source.publicationYear || 'n.d.';
    const title = source.title || '[No title]';
    
    const formatAuthors = (names: string[], style: CitationStyle): string => {
      if (names.length === 0) return '';
      if (names.length === 1) return names[0];

      switch (style) {
        case 'APA':
          return names.length >= 1 ? `${names[0]} et al.` : '';
        case 'MLA':
          return names.length === 2 
            ? `${names[0]} and ${names[1]}` 
            : `${names[0]} et al.`;
        case 'Chicago':
          return names.length === 2 
            ? `${names[0]} and ${names[1]}` 
            : `${names[0]} et al.`;
        default:
          return names.join(', ');
      }
    };

    const authorsList = formatAuthors(authorNames, style);

    switch (style) {
      case 'APA': {
        const parts: string[] = [];
        if (authorsList) parts.push(`${authorsList} (${year})`);
        parts.push(`${title}.`);
        
        if (source.journal) {
          parts.push(source.journal + '.');
        } else if (source.publisher) {
          parts.push(source.publisher + '.');
        }
        
        return parts.join(' ');
      }
      case 'MLA': {
        const parts: string[] = [];
        if (authorsList) {
          parts.push(`${authorsList}.`);
        }
        parts.push(`"${title}."`);
        parts.push(year);
        return parts.join(' ');
      }
      case 'Chicago': {
        const parts: string[] = [];
        if (authorsList) {
          parts.push(`${authorsList},`);
        }
        parts.push(`${year}.`);
        parts.push(`"${title}."`);
        return parts.join(' ');
      }
      default:
        return title;
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      
      // Clear previous timeout if exists
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  useEffect(() => {
    setCitation(generateCitation(citationStyle));
  }, [citationStyle, source]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="citation-configurator">
      <div className="style-selector">
        <label htmlFor="citation-style">Citation Style:</label>
        <select 
          id="citation-style"
          value={citationStyle}
          onChange={(e) => setCitationStyle(e.target.value as CitationStyle)}
        >
          <option value="APA">APA</option>
          <option value="MLA">MLA</option>
          <option value="Chicago">Chicago</option>
        </select>
      </div>
      
      <div className="citation-preview">
        <textarea 
          readOnly 
          value={citation}
          rows={3}
          aria-label="Generated citation"
        />
      </div>
      
      <button 
        className="copy-button"
        onClick={() => handleCopyToClipboard(citation)}
        aria-label="Copy to clipboard"
      >
        Copy
      </button>
      {copied && <span className="copied-indicator">Copied!</span>}
    </div>
  );
};

export default CitationConfigurator;