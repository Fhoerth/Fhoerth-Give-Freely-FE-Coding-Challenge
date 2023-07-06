import '~styles/base.css';
import '~styles/style.css';

import { CommunicationChannelContextProvider } from './Context';
import { ParticipantsMenu } from './ParticipantsMenu';

function IndexPopup() {
  return (
    <CommunicationChannelContextProvider>
      <div className="bg-gray-100 min-w-[350px]">
        <ParticipantsMenu />
      </div>
    </CommunicationChannelContextProvider>
  );
}

export default IndexPopup;
