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
    togglePlay,
  } = usePlayer();
  const currentPlayingEpisode = currentPlayList[currentEpisodeIndex];

  const handlePlayButtonClick = (episodeId: number, index: number) => {
    const isThisEpisodeTheCurrentOneInPlayer = currentPlayingEpisode?.id === episodeId;

    if (isThisEpisodeTheCurrentOneInPlayer) {
      togglePlay();
    } else {
      playList(latestEpisodes, index);
    }
  };

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
            onClick={() => handlePlayButtonClick(episode.id, index)}
            className={styles.playButton}
          >
            <Image
              width={30}
              height={30}
              src={currentPlayingEpisode?.id === episode.id && isPlaying ? "/pause.svg" : "/play-green.svg"}
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
