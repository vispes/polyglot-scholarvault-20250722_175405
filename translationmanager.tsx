const TranslationManager = ({ projectId }: Props) => {
  type ActionType = 'starting' | 'pausing' | 'resetting' | null;
  
  const [currentAction, setCurrentAction] = useState<ActionType>(null);
  const [error, setError] = useState<string | null>(null);

  const ERROR_MESSAGE_START = 'Failed to start pipeline';
  const ERROR_MESSAGE_PAUSE = 'Failed to pause translation';
  const ERROR_MESSAGE_RESET = 'Failed to reset job';

  const startPipeline = async () => {
    setCurrentAction('starting');
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Starting translation pipeline for project: ${projectId}`);
    } catch (err) {
      setError(ERROR_MESSAGE_START);
    } finally {
      setCurrentAction(null);
    }
  };

  const pauseTranslation = async () => {
    setCurrentAction('pausing');
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Pausing translation for project: ${projectId}`);
    } catch (err) {
      setError(ERROR_MESSAGE_PAUSE);
    } finally {
      setCurrentAction(null);
    }
  };

  const resetJob = async () => {
    setCurrentAction('resetting');
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Resetting job for project: ${projectId}`);
    } catch (err) {
      setError(ERROR_MESSAGE_RESET);
    } finally {
      setCurrentAction(null);
    }
  };

  const getButtonState = (actionType: ActionType) => ({
    disabled: currentAction !== null,
    text: currentAction === actionType ? `${actionType[0].toUpperCase() + actionType.slice(1, -3)}ing...` : 
          actionType === 'starting' ? 'Start Pipeline' :
          actionType === 'pausing' ? 'Pause Translation' : 'Reset Job'
  });

  return (
    <div className="translation-manager">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="button-group">
        <button 
          onClick={startPipeline}
          disabled={currentAction !== null}
          className={`action-btn ${currentAction === 'starting' ? 'active' : ''}`}
        >
          {getButtonState('starting').text}
        </button>
        
        <button 
          onClick={pauseTranslation}
          disabled={currentAction !== null}
          className={`action-btn ${currentAction === 'pausing' ? 'active' : ''}`}
        >
          {getButtonState('pausing').text}
        </button>
        
        <button 
          onClick={resetJob}
          disabled={currentAction !== null}
          className={`action-btn ${currentAction === 'resetting' ? 'active' : ''}`}
        >
          {getButtonState('resetting').text}
        </button>
      </div>
    </div>
  );
};

export default TranslationManager;