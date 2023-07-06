import type { Participant } from '~API/types';

interface ParticipantMenuProps {
  participant: Participant;
  onGoBack: () => void;
}

export const ParticipantMenu: React.FC<ParticipantMenuProps> = ({
  participant,
  onGoBack,
}) => {
  return (
    <div>
      <button
        className="absolute top-0 right-0 pt-2 pr-2 cursor-pointer"
        onClick={onGoBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <ul className="space-y-2">
        {participant.messages.map((message) => (
          <li>
            <p className="w-[350px] p-4 text-green-700 text-left text-lg">
              {message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
