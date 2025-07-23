export const SplitView: React.FC<SplitViewProps> = ({ original, translation }) => {
  const [leftWidth, setLeftWidth] = useState(50);
  const leftWidthRef = useRef(leftWidth);
  const splitViewRef = useRef<HTMLDivElement>(null);
  const startWidthRef = useRef(0);
  const startXRef = useRef(0);

  useEffect(() => {
    leftWidthRef.current = leftWidth;
  }, [leftWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!splitViewRef.current) return;
    
    const containerWidth = splitViewRef.current.getBoundingClientRect().width;
    const delta = e.clientX - startXRef.current;
    let newWidthPercent = ((startWidthRef.current + delta) / containerWidth) * 100;
    
    newWidthPercent = Math.max(10, Math.min(90, newWidthPercent));
    setLeftWidth(newWidthPercent);
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!splitViewRef.current) return;

    startXRef.current = e.clientX;
    startWidthRef.current = (leftWidthRef.current / 100) * splitViewRef.current.getBoundingClientRect().width;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={splitViewRef}
      className="flex h-full w-full"
    >
      <div 
        className="overflow-auto h-full"
        style={{ width: `calc(${leftWidth}% - 2px)` }}
      >
        {original}
      </div>
      <div 
        className="flex items-center justify-center cursor-col-resize select-none w-[4px] bg-[#f0f0f0]"
        onMouseDown={handleMouseDown}
      >
        <div className="w-[2px] h-[50px] bg-[#ccc]" />
      </div>
      <div 
        className="overflow-auto h-full"
        style={{ width: `calc(${100 - leftWidth}% - 2px)` }}
      >
        {translation}
      </div>
    </div>
  );
};