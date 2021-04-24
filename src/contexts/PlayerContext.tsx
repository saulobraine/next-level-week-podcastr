import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (episode) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  isLooping: boolean;
  setIsLooping: Dispatch<SetStateAction<boolean>>;
  isShuffling: boolean;
  setIsShuffling: Dispatch<SetStateAction<boolean>>;
  hasNext: boolean;
  hasPrevious: boolean;
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const hasNext = isShuffling ? true : (currentEpisodeIndex - 1) >= 0;
  const hasPrevious = isShuffling ? false : (currentEpisodeIndex + 1) < episodeList.length;

  function playNext() {

    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);

    } else if (isLooping) {
      return;

    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    } else {
      setCurrentEpisodeIndex(episodeList.length - 1);
    }
  }

  function playPrevious() {

    if (!isShuffling) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

  }

  return (
    <PlayerContext.Provider value={{
      currentEpisodeIndex,
      episodeList,
      play,
      isPlaying,
      setIsPlaying,
      isLooping,
      setIsLooping,
      isShuffling,
      setIsShuffling,
      playList,
      playNext,
      playPrevious,
      hasNext,
      hasPrevious
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}