import React, { useState } from 'react';
import styled from 'styled-components';
import useOverlayStore, { OverlayPosition, OverlayDisplayStyle } from '../../store/overlay';
import useConnectionsStore from '../../store/connections';
import { ConnectionType } from '../../types/pluralkit';
import connectionsController from '../../controllers/ConnectionsController';
import SystemConnectionManager from './SystemConnectionManager';

/**
 * Main settings panel component
 * Provides UI for configuring the overlay and managing system connections
 */
const SettingsPanel: React.FC = () => {
  // State from stores
  const overlayStore = useOverlayStore();
  const connectionsStore = useConnectionsStore();
  
  // Local state
  const [activeTab, setActiveTab] = useState<'display' | 'connections'>('display');
  const [systemToken, setSystemToken] = useState('');
  const [systemId, setSystemId] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Handle system authentication
  const handleAuthenticateSystem = async () => {
    if (!systemToken.trim()) {
      setAuthError('Please enter a valid system token');
      return;
    }
    
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      const success = await connectionsController.authenticateOwnSystem(systemToken.trim());
      
      if (success) {
        setSystemToken('');
      } else {
        setAuthError('Failed to authenticate with the provided token');
      }
    } catch (error) {
      setAuthError('An error occurred during authentication');
      console.error('Authentication error:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  // Handle system disconnection
  const handleDisconnectSystem = async () => {
    try {
      await connectionsController.disconnectOwnSystem();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };
  
  // Handle connecting to a system
  const handleConnectToSystem = async () => {
    if (!systemId.trim()) {
      setAuthError('Please enter a valid system ID');
      return;
    }
    
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      const success = await connectionsController.connectToSystem(
        systemId.trim(),
        ConnectionType.MANUAL
      );
      
      if (success) {
        setSystemId('');
      } else {
        setAuthError(
          'Failed to connect to the system. Make sure the ID is correct and the system has granted you access.'
        );
      }
    } catch (error) {
      setAuthError('An error occurred while connecting to the system');
      console.error('Connection error:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  return (
    <SettingsPanelContainer>
      <SettingsTabs>
        <SettingsTab
          active={activeTab === 'display'}
          onClick={() => setActiveTab('display')}
        >
          Display Settings
        </SettingsTab>
        <SettingsTab
          active={activeTab === 'connections'}
          onClick={() => setActiveTab('connections')}
        >
          System Connections
        </SettingsTab>
      </SettingsTabs>
      
      <SettingsContent>
        {activeTab === 'display' ? (
          <DisplaySettings>
            <SettingsGroup>
              <SettingsLabel>Enable Overlay</SettingsLabel>
              <ToggleSwitch
                checked={overlayStore.enabled}
                onChange={() => overlayStore.setEnabled(!overlayStore.enabled)}
              />
            </SettingsGroup>
            
            <SettingsGroup>
              <SettingsLabel>Display Style</SettingsLabel>
              <Select
                value={overlayStore.displayStyle}
                onChange={(e) => overlayStore.setDisplayStyle(e.target.value as OverlayDisplayStyle)}
              >
                <option value={OverlayDisplayStyle.MINIMAL}>Minimal</option>
                <option value={OverlayDisplayStyle.STANDARD}>Standard</option>
                <option value={OverlayDisplayStyle.DETAILED}>Detailed</option>
              </Select>
            </SettingsGroup>
            
            <SettingsGroup>
              <SettingsLabel>Position</SettingsLabel>
              <Select
                value={overlayStore.position}
                onChange={(e) => overlayStore.setPosition(e.target.value as OverlayPosition)}
              >
                <option value={OverlayPosition.TOP_LEFT}>Top Left</option>
                <option value={OverlayPosition.TOP_RIGHT}>Top Right</option>
                <option value={OverlayPosition.BOTTOM_LEFT}>Bottom Left</option>
                <option value={OverlayPosition.BOTTOM_RIGHT}>Bottom Right</option>
                <option value={OverlayPosition.CUSTOM}>Custom (Draggable)</option>
              </Select>
            </SettingsGroup>
            
            <SettingsGroup>
              <SettingsLabel>Show System Names</SettingsLabel>
              <ToggleSwitch
                checked={overlayStore.showSystemName}
                onChange={() => overlayStore.setShowSystemName(!overlayStore.showSystemName)}
              />
            </SettingsGroup>
            
            <SettingsGroup>
              <SettingsLabel>Use Member Colors</SettingsLabel>
              <ToggleSwitch
                checked={overlayStore.showMemberColor}
                onChange={() => overlayStore.setShowMemberColor(!overlayStore.showMemberColor)}
              />
            </SettingsGroup>
            
            <SettingsGroup>
              <SettingsLabel>Dark Mode</SettingsLabel>
              <ToggleSwitch
                checked={overlayStore.darkMode}
                onChange={() => overlayStore.setDarkMode(!overlayStore.darkMode)}
              />
            </SettingsGroup>
            
            <SettingsGroup>
              <SettingsLabel>Opacity: {Math.round(overlayStore.opacity * 100)}%</SettingsLabel>
              <RangeSlider
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={overlayStore.opacity}
                onChange={(e) => overlayStore.setOpacity(parseFloat(e.target.value))}
              />
            </SettingsGroup>
            
            <SettingsGroup>
              <SettingsLabel>Scale: {overlayStore.scale.toFixed(1)}x</SettingsLabel>
              <RangeSlider
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={overlayStore.scale}
                onChange={(e) => overlayStore.setScale(parseFloat(e.target.value))}
              />
            </SettingsGroup>
          </DisplaySettings>
        ) : (
          <ConnectionsSettings>
            <SettingsSection>
              <SectionTitle>Your System</SectionTitle>
              {connectionsStore.ownSystem ? (
                <SystemInfo>
                  <SystemName>{connectionsStore.ownSystem.name}</SystemName>
                  <SystemId>ID: {connectionsStore.ownSystem.id}</SystemId>
                  <DisconnectButton onClick={handleDisconnectSystem}>
                    Disconnect System
                  </DisconnectButton>
                </SystemInfo>
              ) : (
                <AuthForm>
                  <FormGroup>
                    <FormLabel>PluralKit System Token</FormLabel>
                    <FormInput
                      type="password"
                      value={systemToken}
                      onChange={(e) => setSystemToken(e.target.value)}
                      placeholder="Enter your system token"
                    />
                  </FormGroup>
                  {authError && <ErrorMessage>{authError}</ErrorMessage>}
                  <AuthButton 
                    onClick={handleAuthenticateSystem} 
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? 'Authenticating...' : 'Authenticate System'}
                  </AuthButton>
                </AuthForm>
              )}
            </SettingsSection>
            
            <SettingsSection>
              <SectionTitle>Connected Systems</SectionTitle>
              <SystemConnectionManager />
              
              <ConnectForm>
                <FormGroup>
                  <FormLabel>Connect to a System</FormLabel>
                  <FormInput
                    type="text"
                    value={systemId}
                    onChange={(e) => setSystemId(e.target.value)}
                    placeholder="Enter system ID"
                  />
                </FormGroup>
                <ConnectButton 
                  onClick={handleConnectToSystem} 
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? 'Connecting...' : 'Connect'}
                </ConnectButton>
              </ConnectForm>
            </SettingsSection>
          </ConnectionsSettings>
        )}
      </SettingsContent>
    </SettingsPanelContainer>
  );
};

// Styled components
const SettingsPanelContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: #36393f;
  color: #dcddde;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const SettingsTabs = styled.div`
  display: flex;
  background-color: #2f3136;
  border-bottom: 1px solid #202225;
`;

const SettingsTab = styled.div<{ active: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  background-color: ${(props) => (props.active ? '#36393f' : 'transparent')};
  color: ${(props) => (props.active ? '#ffffff' : '#b9bbbe')};
  font-weight: ${(props) => (props.active ? '600' : '400')};
  border-bottom: 2px solid ${(props) => (props.active ? '#7289da' : 'transparent')};
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: ${(props) => (props.active ? '#36393f' : '#32353b')};
  }
`;

const SettingsContent = styled.div`
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2f3136;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #202225;
    border-radius: 4px;
  }
`;

const DisplaySettings = styled.div``;

const ConnectionsSettings = styled.div``;

const SettingsGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingsLabel = styled.label`
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
`;

const Select = styled.select`
  background-color: #2f3136;
  color: #dcddde;
  border: 1px solid #202225;
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 14px;
  width: 180px;
  
  &:focus {
    outline: none;
    border-color: #7289da;
  }
`;

// Toggle switch component
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <ToggleSwitchContainer onClick={onChange}>
    <ToggleInput type="checkbox" checked={checked} onChange={onChange} />
    <ToggleSlider checked={checked} />
  </ToggleSwitchContainer>
);

const ToggleSwitchContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleSlider = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => (props.checked ? '#7289da' : '#72767d')};
  transition: 0.3s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    transform: ${(props) => (props.checked ? 'translateX(16px)' : 'translateX(0)')};
  }
`;

const RangeSlider = styled.input`
  -webkit-appearance: none;
  width: 180px;
  height: 6px;
  background: #4f545c;
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #7289da;
    cursor: pointer;
    border-radius: 50%;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #7289da;
    cursor: pointer;
    border-radius: 50%;
    border: none;
  }
`;

const SettingsSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #40444b;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #ffffff;
`;

const SystemInfo = styled.div`
  background-color: #2f3136;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const SystemName = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`;

const SystemId = styled.div`
  font-size: 12px;
  color: #a3a6aa;
  margin-bottom: 12px;
  word-break: break-all;
`;

const DisconnectButton = styled.button`
  background-color: #ed4245;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #c03c3f;
  }
`;

const AuthForm = styled.div`
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background-color: #202225;
  color: #dcddde;
  border: 1px solid #40444b;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #7289da;
  }
  
  &::placeholder {
    color: #72767d;
  }
`;

const ErrorMessage = styled.div`
  color: #ed4245;
  font-size: 12px;
  margin-bottom: 12px;
`;

const AuthButton = styled.button`
  background-color: #7289da;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #5c6fb1;
  }
  
  &:disabled {
    background-color: #72767d;
    cursor: not-allowed;
  }
`;

const ConnectForm = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  
  ${FormGroup} {
    flex: 1;
    margin-bottom: 0;
  }
`;

const ConnectButton = styled.button`
  background-color: #43b581;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  height: 36px;
  
  &:hover {
    background-color: #3a9c72;
  }
  
  &:disabled {
    background-color: #72767d;
    cursor: not-allowed;
  }
`;

export default SettingsPanel;