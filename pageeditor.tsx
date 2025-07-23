const PageEditor: React.FC<PageEditorProps> = ({ content, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="page-editor">
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full h-full p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter page content..."
      />
    </div>
  );
};

export default PageEditor;