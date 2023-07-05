import type { Participant } from '~API/types';
import { CountButton } from '~features/CountButton';
import { getRandomMessage } from '~utils/getRandomMessage';

interface BannerProps {
  participant: Participant;
}

export const Banner: React.FC<BannerProps> = ({ participant }) => {
  const message = getRandomMessage(participant.messages);

  return (
    <div className="bg-green-100 border-green-300 text-green-700 text-center border-solid border-x border-y px-8 py-8 text-2xl">
      {message}
    </div>
  );
};
