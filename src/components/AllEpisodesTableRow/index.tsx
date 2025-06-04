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
  } = usePlayer();
  const currentPlayingEpisode = currentPlayList[currentEpisodeIndex];

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
          onClick={() => playList(allEpisodes, index)}
          className={styles.playButton}
        >
          <Image
            width={24}
            height={24}
            src={"/play-green.svg"}
            alt={
              isPlaying && currentPlayingEpisode?.id === episode.id
                ? "Pausar episódio"
                : `Tocar episódio ${episode.title}`
            }
          />
        </button>
      </td>
    </tr>
  );
}
