import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useOverlayStore, { OverlayPosition, OverlayDisplayStyle } from '../../store/overlay';
import { FronterDisplay } from '../../types/pluralkit';
import FronterCard from './FronterCard';
import overlayController from '../../controllers/OverlayController';

/**
 * Main overlay component
 * Displays fronting information for connected systems in voice channels
 */
const Overlay: React.FC = () => {
  // Get overlay state from store
  const {
    enabled,
    visible,
    position,
    customPosition,
    displayStyle,
    opacity,
    scale,
    darkMode,
    fronterDisplays,
  } = useOverlayStore();
  
  // Local state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [customPos, setCustomPos] = useState(customPosition || { x: 20, y: 20 });
  
  // Initialize the overlay controller
  useEffect(() => {
    overlayController.initialize();
    
    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      overlayController.refreshFronterDisplays();
    }, 30000); // 30 seconds
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);
  
  // Handle position updates
  useEffect(() => {
    if (customPosition) {
      setCustomPos(customPosition);
    }
  }, [customPosition]);
  
  // If not enabled or not visible, don't render
  if (!enabled || !visible || fronterDisplays.length === 0) {
    return null;
  }
  
  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (position !== OverlayPosition.CUSTOM) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - customPos.x,
      y: e.clientY - customPos.y,
    });
    
    // Prevent text selection during drag
    e.preventDefault();
  };
  
  // Handle drag move
  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newPos = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
    
    setCustomPos(newPos);
    
    // Update store with new position
    useOverlayStore.getState().setCustomPosition(newPos);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Calculate position based on setting
  const getPositionStyle = () => {
    switch (position) {
      case OverlayPosition.TOP_LEFT:
        return { top: '20px', left: '20px' };
      case OverlayPosition.TOP_RIGHT:
        return { top: '20px', right: '20px' };
      case OverlayPosition.BOTTOM_LEFT:
        return { bottom: '20px', left: '20px' };
      case OverlayPosition.BOTTOM_RIGHT:
        return { bottom: '20px', right: '20px' };
      case OverlayPosition.CUSTOM:
        return { top: `${customPos.y}px`, left: `${customPos.x}px` };
      default:
        return { top: '20px', right: '20px' };
    }
  };
  
  // Effect to handle global mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newPos = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      
      setCustomPos(newPos);
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        
        // Update store with final position
        useOverlayStore.getState().setCustomPosition(customPos);
      }
    };
    
    // Add global event listeners
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, customPos]);
  
  return (
    <OverlayContainer
      style={{
        ...getPositionStyle(),
        opacity,
        transform: `scale(${scale})`,
        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        color: darkMode ? '#ffffff' : '#000000',
        cursor: position === OverlayPosition.CUSTOM ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
    >
      {fronterDisplays.map((display) => (
        <FronterCard
          key={`${display.systemId}-${display.discordUserId}`}
          display={display}
          displayStyle={displayStyle}
          darkMode={darkMode}
        />
      ))}
    </OverlayContainer>
  );
};

// Styled components
const OverlayContainer = styled.div`
  position: fixed;
  z-index: 9999;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(5px);
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 3px;
  }
`;

export default Overlay;