import React from 'react';
import styled from 'styled-components';
import useConnectionsStore from '../../store/connections';
import { ConnectionType } from '../../types/pluralkit';
import connectionsController from '../../controllers/ConnectionsController';

/**
 * Component for managing connected systems
 */
const SystemConnectionManager: React.FC = () => {
  const { connectedSystems } = useConnectionsStore();
  
  // Handle disconnecting from a system
  const handleDisconnect = async (systemId: string) => {
    try {
      await connectionsController.disconnectFromSystem(systemId);
    } catch (error) {
      console.error('Error disconnecting from system:', error);
    }
  };
  
  // If no connected systems, show empty state
  if (connectedSystems.length === 0) {
    return (
      <EmptyState>
        No connected systems yet. Connect to a system using the form below or wait for systems to connect automatically.
      </EmptyState>
    );
  }
  
  return (
    <SystemsList>
      {connectedSystems.map((system) => (
        <SystemItem key={system.id}>
          <SystemInfo>
            <SystemName>{system.name}</SystemName>
            <SystemDetails>
              <SystemId>ID: {system.id}</SystemId>
              <ConnectionBadge type={system.connectionType}>
                {system.connectionType === ConnectionType.AUTOMATIC
                  ? 'Auto Connected'
                  : 'Manually Connected'}
              </ConnectionBadge>
            </SystemDetails>
            <LastUpdated>
              Last updated: {new Date(system.lastUpdated).toLocaleString()}
            </LastUpdated>
          </SystemInfo>
          <ActionButtons>
            <DisconnectButton
              onClick={() => handleDisconnect(system.id)}
              title="Disconnect"
            >
              Disconnect
            </DisconnectButton>
          </ActionButtons>
        </SystemItem>
      ))}
    </SystemsList>
  );
};

// Styled components
const SystemsList = styled.div`
  margin-bottom: 20px;
  max-height: 300px;
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

const SystemItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2f3136;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SystemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SystemName = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  word-break: break-word;
`;

const SystemDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  flex-wrap: wrap;
  gap: 8px;
`;

const SystemId = styled.div`
  font-size: 12px;
  color: #a3a6aa;
`;

const ConnectionBadge = styled.div<{ type: ConnectionType }>`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.type === ConnectionType.AUTOMATIC ? '#43b581' : '#7289da'};
  color: white;
  display: inline-block;
`;

const LastUpdated = styled.div`
  font-size: 11px;
  color: #a3a6aa;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 12px;
`;

const DisconnectButton = styled.button`
  background-color: #4f545c;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #ed4245;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: #a3a6aa;
  font-size: 14px;
  background-color: #2f3136;
  border-radius: 4px;
  margin-bottom: 20px;
`;

export default SystemConnectionManager;