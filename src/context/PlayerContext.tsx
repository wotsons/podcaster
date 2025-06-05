"use client";

import { createContext, useState, ReactNode, useContext, useCallback } from "react";

import { FormattedEpisode as Episode } from "@/types/Episodes";

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  currentEpisode: Episode | null;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayer: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export const PlayerContext = createContext<PlayerContextData | undefined>(undefined);

export function PlayerContextProvider({ children }: { children: ReactNode }) {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const currentEpisode = episodeList[currentEpisodeIndex] || null;

  const play = useCallback((episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }, []);

  const playList = useCallback((list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffling((prev) => !prev);
  }, []);

  const setPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state);
  }, []);

  const playNext = useCallback(() => {
    if (episodeList.length === 0) return;

    let nextIndex = -1;

    if (isShuffling && episodeList.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * episodeList.length);
      } while (nextIndex === currentEpisodeIndex);
    } else {
      if (currentEpisodeIndex + 1 < episodeList.length) {
        nextIndex = currentEpisodeIndex + 1;
      } else if (isLooping) {
        nextIndex = 0;
      }
    }

    if (nextIndex !== -1) {
      setCurrentEpisodeIndex(nextIndex);
      setIsPlaying(true);
    }
  }, [currentEpisodeIndex, episodeList, isLooping, isShuffling]);

  const playPrevious = useCallback(() => {
    if (episodeList.length === 0) return;

    let prevIndex = -1;

    if (currentEpisodeIndex > 0) {
      prevIndex = currentEpisodeIndex - 1;
    } else if (isLooping && episodeList.length > 0) {
      prevIndex = episodeList.length - 1;
    }

    if (prevIndex !== -1) {
      setCurrentEpisodeIndex(prevIndex);
      setIsPlaying(true);
    }
  }, [currentEpisodeIndex, episodeList, isLooping]);

  const clearPlayer = useCallback(() => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(false);
  }, []);

  const hasNext = episodeList.length > 0 && ((isShuffling && episodeList.length > 1) || (currentEpisodeIndex + 1 < episodeList.length) || isLooping);
  const hasPrevious = episodeList.length > 0 && ((currentEpisodeIndex > 0) || (isLooping && episodeList.length > 1));

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      currentEpisode,
      play,
      playList,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayingState,
      playNext,
      playPrevious,
      clearPlayer,
      hasNext,
      hasPrevious,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer deve ser usado dentro de um PlayerContextProvider");
  }
  return context;
};
