import React from 'react';
import styled from 'styled-components';
import { FronterDisplay } from '../../types/pluralkit';
import { OverlayDisplayStyle } from '../../store/overlay';
import { formatDistanceToNow } from 'date-fns';

interface FronterCardProps {
  display: FronterDisplay;
  displayStyle: OverlayDisplayStyle;
  darkMode: boolean;
}

/**
 * Component for displaying a system's fronters in the overlay
 */
const FronterCard: React.FC<FronterCardProps> = ({ display, displayStyle, darkMode }) => {
  const { systemName, members, timestamp } = display;
  
  // Format the timestamp as a relative time
  const formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  
  // Get primary member color or default
  const getPrimaryColor = () => {
    if (members.length > 0 && members[0].color) {
      return `#${members[0].color}`;
    }
    return darkMode ? '#ffffff' : '#000000';
  };
  
  return (
    <CardContainer darkMode={darkMode}>
      {/* System name header */}
      <SystemName color={getPrimaryColor()}>
        {systemName}
      </SystemName>
      
      {/* Members list */}
      <MembersList>
        {members.map((member) => (
          <MemberItem 
            key={member.id} 
            style={{ color: member.color ? `#${member.color}` : 'inherit' }}
            displayStyle={displayStyle}
          >
            {/* Avatar (for standard and detailed display) */}
            {displayStyle !== OverlayDisplayStyle.MINIMAL && member.avatar_url && (
              <MemberAvatar src={member.avatar_url} alt={member.name} />
            )}
            
            {/* Member information */}
            <MemberInfo>
              <MemberName>
                {member.display_name || member.name}
              </MemberName>
              
              {/* Additional info for detailed display */}
              {displayStyle === OverlayDisplayStyle.DETAILED && (
                <>
                  {member.pronouns && (
                    <MemberPronouns>
                      {member.pronouns}
                    </MemberPronouns>
                  )}
                  
                  {member.description && (
                    <MemberDescription>
                      {member.description.length > 100
                        ? `${member.description.substring(0, 100)}...`
                        : member.description}
                    </MemberDescription>
                  )}
                </>
              )}
            </MemberInfo>
          </MemberItem>
        ))}
      </MembersList>
      
      {/* Timestamp footer */}
      <TimestampFooter>
        {formattedTime}
      </TimestampFooter>
    </CardContainer>
  );
};

// Styled components
const CardContainer = styled.div<{ darkMode: boolean }>`
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  background-color: ${(props) => props.darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(240, 240, 240, 0.8)'};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const SystemName = styled.h3<{ color?: string }>`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.color || 'inherit'};
  border-bottom: 1px solid rgba(150, 150, 150, 0.3);
  padding-bottom: 4px;
`;

const MembersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 8px 0;
`;

const MemberItem = styled.li<{ displayStyle: OverlayDisplayStyle }>`
  display: flex;
  align-items: ${(props) => props.displayStyle === OverlayDisplayStyle.DETAILED ? 'flex-start' : 'center'};
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px dotted rgba(150, 150, 150, 0.2);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const MemberAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MemberName = styled.span`
  font-weight: 500;
  font-size: 13px;
`;

const MemberPronouns = styled.span`
  font-size: 11px;
  opacity: 0.8;
  margin-top: 2px;
`;

const MemberDescription = styled.p`
  font-size: 11px;
  margin: 4px 0 0 0;
  opacity: 0.7;
  line-height: 1.3;
`;

const TimestampFooter = styled.div`
  font-size: 10px;
  text-align: right;
  opacity: 0.6;
  margin-top: 4px;
`;

export default FronterCard;