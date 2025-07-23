const GoogleDocsPreview = React.forwardRef<GoogleDocsPreviewHandle, { documentId: string | null }>(
  ({ documentId }, ref) => {
    const [refreshKey, setRefreshKey] = React.useState(0);

    React.useImperativeHandle(ref, () => ({
      refreshDocument: () => {
        if (documentId) {
          setRefreshKey(prev => prev + 1);
        }
      }
    }));

    const iframeKey = `${documentId}-${refreshKey}`;

    let previewContent;
    if (documentId) {
      previewContent = (
        <iframe
          key={iframeKey}
          src={`https://docs.google.com/document/d/${documentId}/preview`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Google Docs Preview"
        />
      );
    } else {
      previewContent = (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#666',
          fontSize: '1rem'
        }}>
          No document to preview
        </div>
      );
    }

    return (
      <div style={{ width: '100%', height: '100%' }}>
        {previewContent}
      </div>
    );
  }
);

export default GoogleDocsPreview;