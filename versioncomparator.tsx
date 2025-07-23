const VersionComparator: React.FC<VersionComparatorProps> = ({
  versions,
  selectVersionPair,
}) => {
  const [leftVersionId, setLeftVersionId] = useState<string | null>(null);
  const [rightVersionId, setRightVersionId] = useState<string | null>(null);

  useEffect(() => {
    if (leftVersionId && rightVersionId) {
      selectVersionPair(leftVersionId, rightVersionId);
    }
  }, [leftVersionId, rightVersionId, selectVersionPair]);

  useEffect(() => {
    const versionIds = new Set(versions.map(v => v.id));
    const isLeftValid = leftVersionId != null && versionIds.has(leftVersionId);
    const isRightValid = rightVersionId != null && versionIds.has(rightVersionId);
    
    let newLeft: string | null = isLeftValid ? leftVersionId : null;
    let newRight: string | null = isRightValid ? rightVersionId : null;
    
    // Prevent same version in both dropdowns
    if (newLeft && newRight && newLeft === newRight) {
      newRight = null;
    }
    
    setLeftVersionId(newLeft);
    setRightVersionId(newRight);
    
    // Reset parent selection when version pair becomes invalid
    const wasSet = leftVersionId && rightVersionId;
    if (wasSet && 
        (!isLeftValid || !isRightValid || leftVersionId === rightVersionId)) {
      selectVersionPair(null, null);
    }
  }, [versions, selectVersionPair]);

  return (
    <div className="version-comparator" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <select 
        value={leftVersionId || ''}
        onChange={e => setLeftVersionId(e.target.value || null)}
        aria-label="Select left version"
      >
        <option value="">Select version...</option>
        {versions.map(version => (
          <option 
            key={`left-${version.id}`} 
            value={version.id}
            disabled={version.id === rightVersionId}
          >
            {version.name}
          </option>
        ))}
      </select>

      <span>to</span>

      <select 
        value={rightVersionId || ''}
        onChange={e => setRightVersionId(e.target.value || null)}
        aria-label="Select right version"
      >
        <option value="">Select version...</option>
        {versions.map(version => (
          <option 
            key={`right-${version.id}`} 
            value={version.id}
            disabled={version.id === leftVersionId}
          >
            {version.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VersionComparator;