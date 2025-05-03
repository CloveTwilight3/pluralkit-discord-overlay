import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Overlay from './Overlay/Overlay';
import SettingsPanel from './Settings/SettingsPanel';
import connectionsController from '../controllers/ConnectionsController';
import overlayController from '../controllers/OverlayController';

/**
 * Main application component
 */
const App: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize controllers
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize connections
        await connectionsController.initialize();
        
        // Initialize overlay
        await overlayController.initialize();
        
        // Mark as initialized
        setInitialized(true);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Failed to initialize the application. Please make sure Discord is running and reload the plugin.');
      }
    };
    
    initialize();
  }, []);
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // If initialization failed, show error
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  // If not initialized yet, show loading
  if (!initialized) {
    return <LoadingIndicator>Initializing PluralKit overlay...</LoadingIndicator>;
  }
  
  return (
    <AppContainer>
      {/* Settings button */}
      <SettingsButton onClick={toggleSettings}>
        <SettingsIcon />
      </SettingsButton>
      
      {/* Settings panel (modal) */}
      {showSettings && (
        <SettingsModal>
          <ModalBackdrop onClick={toggleSettings} />
          <ModalContent>
            <SettingsPanel />
            <CloseButton onClick={toggleSettings}>×</CloseButton>
          </ModalContent>
        </SettingsModal>
      )}
      
      {/* Overlay (always render, visibility controlled by the component) */}
      <Overlay />
    </AppContainer>
  );
};

// Styled components
const AppContainer = styled.div`
  position: relative;
  width: 0;
  height: 0;
  overflow: visible;
`;

const SettingsButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #7289da;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 9998;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #5c6fb1;
  }
`;

const SettingsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SettingsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled.div`
  position: relative;
  z-index: 10001;
  max-width: 90%;
  max-height: 90%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ed4245;
  color: white;
  border: none;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const LoadingIndicator = styled.div`
  position: fixed;
  bottom: 75px;
  right: 20px;
  background-color: #36393f;
  color: #dcddde;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9997;
`;

const ErrorMessage = styled.div`
  position: fixed;
  bottom: 75px;
  right: 20px;
  background-color: #ed4245;
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9997;
`;

export default App;