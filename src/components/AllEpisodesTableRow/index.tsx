"use client";

import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import type { FormattedEpisode } from "@/types/Episodes";
import styles from "./styles.module.scss";

interface AllEpisodesTableRowProps {
  episode: FormattedEpisode;
  allEpisodes: FormattedEpisode[];
  index: number;
}

export function AllEpisodesTableRow({
  episode,
  allEpisodes,
  index,
}: AllEpisodesTableRowProps) {
  const {
    playList,
    episodeList: currentPlayList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
  } = usePlayer();

  const currentPlayingEpisode = currentPlayList[currentEpisodeIndex];
  const isThisEpisodeTheCurrentOneInPlayer = currentPlayingEpisode?.id === episode.id;

  const handlePlayButtonClick = () => {
    if (isThisEpisodeTheCurrentOneInPlayer) {
      togglePlay();
    } else {
      playList(allEpisodes, index);
    }
  };
  
  return (
    <tr className={styles.episodeRow}>
      <td>
        <Image
          width={120}
          height={120}
          src={episode.thumbnail}
          alt={episode.title}
          className={styles.thumbnail}
        />
      </td>
      <td>
        <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
      </td>
      <td>{episode.members}</td>
      <td style={{ width: 100 }}>{episode.published_at}</td>
      <td>{episode.durationAsString}</td>
      <td>
        <button
          type="button"
          onClick={handlePlayButtonClick}
          className={styles.playButton}
        >
          <Image
            width={24}
            height={24}
            src={isThisEpisodeTheCurrentOneInPlayer && isPlaying ? "/pause.svg" : "/play-green.svg"}
            alt={
              isThisEpisodeTheCurrentOneInPlayer && isPlaying
                ? "Pausar episódio"
                : `Tocar episódio ${episode.title}`
            }
          />
        </button>
      </td>
    </tr>
  );
}
