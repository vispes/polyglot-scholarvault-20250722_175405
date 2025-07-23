function loadAvailableLanguages(): LanguageOption[] {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
  ];
}

const LanguageSelector: React.FC<{ onSelect: (langCode: string) => void }> = ({ onSelect }) => {
  const languages = loadAvailableLanguages();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && languages.length > 0) {
      initialized.current = true;
      const initialLang = languages[0].code;
      setSelectedLanguage(initialLang);
      onSelect(initialLang);
    }
  }, [languages, onSelect]);

  if (languages.length === 0) return null;

  return (
    <select
      value={selectedLanguage}
      onChange={(e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        onSelect(lang);
      }}
      className="language-selector"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;