import { useCallback, useState } from 'react';

import type { Participant } from '~API/types';

import { useFetchParticipants } from './Context';
import { ParticipantMenu } from './ParticipantMenu';
import { ParticipantsMenuItem } from './ParticipantsMenuItem';
import { MenuSkeleton } from './skeleton/MenuSkeleton';

export const ParticipantsMenu: React.FC = () => {
  const { loading, failure, participants } = useFetchParticipants();
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

  const handleOnNavigate = useCallback(
    (participant: Participant) => {
      setSelectedParticipant(participant);
    },
    [setSelectedParticipant],
  );

  const handleOnGoBack = useCallback(() => {
    setSelectedParticipant(null);
  }, [setSelectedParticipant]);

  if (loading) {
    return <MenuSkeleton />;
  }

  if (failure) {
    return (
      <div className="flex items-center justify-start bg-red-100 text-red-600 p-4 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="ml-2 text-lg">Fetch participants failed</p>
      </div>
    );
  }

  if (selectedParticipant) {
    return (
      <ParticipantMenu
        participant={selectedParticipant}
        onGoBack={handleOnGoBack}
      />
    );
  }

  return (
    <ul className="space-y-2">
      {participants.map((participant) => (
        <ParticipantsMenuItem
          key={participant.name}
          participant={participant}
          onNavigate={handleOnNavigate}
        />
      ))}
    </ul>
  );
};
