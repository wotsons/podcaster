/* eslint-disable @next/next/no-img-element */
"use client";

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import type { FormattedEpisode } from "@/types/Episodes";

interface EpisodePlayerButtonProps {
  episode: FormattedEpisode;
}

export default function EpisodePlayerButton({ episode }: EpisodePlayerButtonProps) {
  const { play } = usePlayer();

  return (
    <button type="button" aria-label="Tocar episódio" onClick={() => play(episode)}>
      <img src="/play.svg" alt="Tocar episódio" />
    </button>
  );
}