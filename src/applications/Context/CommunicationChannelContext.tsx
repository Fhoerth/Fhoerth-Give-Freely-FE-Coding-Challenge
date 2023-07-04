import type { ReactElement } from 'react';
import { createContext, useContext } from 'react';

import type { ContentCommunicationChannel } from '~communication-channel';

type CommunicationChannelContextValue = ContentCommunicationChannel;

interface CommunicationChannelContextProviderProps {
  channel: ContentCommunicationChannel;
  children: ReactElement;
}

const CommunicationChannelContext =
  createContext<CommunicationChannelContextValue | null>(null);

export const CommunicationChannelContextProvider: React.FC<
  CommunicationChannelContextProviderProps
> = ({ channel, children }) => {
  return (
    <CommunicationChannelContext.Provider value={channel}>
      {children}
    </CommunicationChannelContext.Provider>
  );
};

export const useCommunicationChannel = () => {
  const channel = useContext(CommunicationChannelContext);

  if (!channel) {
    throw new Error(
      'useCommunicationChannel must be used within CommunicationChannelContextProvider',
    );
  }

  return channel;
};
