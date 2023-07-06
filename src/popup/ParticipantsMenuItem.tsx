import { useCallback } from 'react';

import type { Participant } from '~API/types';

interface ParticipantsMenuItemProps {
  participant: Participant;
  onNavigate: (participant: Participant) => void;
}

export const ParticipantsMenuItem: React.FC<ParticipantsMenuItemProps> = ({
  participant,
  onNavigate,
}) => {
  const handlePariticpantClick = useCallback(() => {
    onNavigate(participant);
  }, [participant]);

  return (
    <li>
      <button
        className="w-[350px] p-4 text-green-700 text-left text-lg hover:underline"
        onClick={handlePariticpantClick}>
        {participant.name}
      </button>
    </li>
  );
};
