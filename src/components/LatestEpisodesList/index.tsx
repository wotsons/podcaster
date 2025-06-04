"use client";

import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import type { FormattedEpisode } from "@/types/Episodes";
import styles from "./styles.module.scss";

interface LatestEpisodesListProps {
  latestEpisodes: FormattedEpisode[];
}

export function LatestEpisodesList({
  latestEpisodes,
}: LatestEpisodesListProps) {
  const {
    playList,
    episodeList: currentPlayList,
    currentEpisodeIndex,
    isPlaying,
  } = usePlayer();
  const currentPlayingEpisode = currentPlayList[currentEpisodeIndex];

  return (
    <ul className={styles.episodeList}>
      {latestEpisodes.map((episode, index) => (
        <li key={episode.id} className={styles.episodeItem}>
          <Image
            width={192}
            height={192}
            src={episode.thumbnail}
            alt={episode.title}
            className={styles.thumbnail}
          />
          
          <div className={styles.episodeDetails}>
            <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
            <p>{episode.members}</p>
            <span>{episode.published_at}</span>
            <span>{episode.durationAsString}</span>
          </div>

          <button
            type="button"
            onClick={() => playList(latestEpisodes, index)}
            className={styles.playButton}
          >
            <Image
              width={30}
              height={30}
              src="/play-green.svg"
              alt={
                isPlaying && currentPlayingEpisode?.id === episode.id
                  ? "Pausar episódio"
                  : "Tocar episódio"
              }
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
