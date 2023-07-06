import type { ReactElement } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Participant } from '~API/types';
import { PopupCommunicationChannel } from '~communication-channel/channels/PopupCommunicationChannel';
import { ChannelName, Client } from '~communication-channel/enums';

type CommunicationChannelContextValue = PopupCommunicationChannel;

interface CommunicationChannelContextProviderProps {
  children: ReactElement;
}

const CommunicationChannelContext =
  createContext<CommunicationChannelContextValue | null>(null);

export const CommunicationChannelContextProvider: React.FC<
  CommunicationChannelContextProviderProps
> = ({ children }) => {
  const [channelHadBeenInitialized, setChannelHadBeenInitialized] =
    useState<boolean>(false);

  const channel = useMemo(
    () =>
      new PopupCommunicationChannel({
        channelName: ChannelName.POPUP,
        client: Client.POPUP,
        clients: [],
      }),
    [],
  );

  useEffect(() => {
    async function initialize() {
      await channel.initialize();

      setChannelHadBeenInitialized(true);
    }

    void initialize();
  }, [channel]);

  if (!channelHadBeenInitialized) {
    return null;
  }

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

export const useFetchParticipants = (): {
  loading: boolean;
  failure: boolean;
  participants: Participant[];
} => {
  const channel = useCommunicationChannel();
  const [fetch, setFetch] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [failure, setFailure] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (fetch) {
      setParticipants([]);
      setLoading(true);
      setFailure(false);

      void channel
        .fetchParticipants()
        .then((fetchParticipantsResponse) => {
          setParticipants(fetchParticipantsResponse.payload as Participant[]);

          setLoading(false);
          setFailure(false);
        })
        .catch(() => {
          setLoading(false);
          setFailure(true);
        });
    }
  }, [fetch]);

  useEffect(() => {
    return () => setFetch(true);
  }, []);

  return {
    loading,
    failure,
    participants,
  };
};
