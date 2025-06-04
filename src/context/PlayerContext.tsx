"use client";

import { createContext } from "react";
import { useState, ReactNode, useContext } from "react";

import { FormattedEpisode as Episode } from "@/types/Episodes";

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: { children: ReactNode }) {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  };

  const playNext = () => {
    if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  const playPrevious = () => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  const hasNext = currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      play,
      playList,
      togglePlay,
      setPlayingState,
      playNext,
      playPrevious,
      hasNext,
      hasPrevious,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer deve ser usado dentro do PlayerContextProvider");
  }
  return context;
};
