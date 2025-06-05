/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";

import Slider from "rc-slider";
import "rc-slider/assets/index.css"

import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { convertDurationToTimeString } from "@/utils/convertDurationToTimeString";

export function Player() {
	const [progress, setProgress] = useState(0);
	const audioRef = useRef<HTMLAudioElement>(null);

	const { isPlaying, episodeList, currentEpisodeIndex, togglePlay, setPlayingState, toggleShuffle, isShuffling, playNext, playPrevious, toggleLoop, isLooping, hasNext, hasPrevious, clearPlayer } = usePlayer();
	const episode = episodeList[currentEpisodeIndex];

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      clearPlayer()
    }
  }

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement || !episode) {
      setProgress(0);
      return;
    }

    const handleTimeUpdate = () => {
      if (audioElement.duration) {
        setProgress(Math.floor(audioElement.currentTime));
      }
    };

    const handleMetadataLoaded = () => {
      audioElement.currentTime = 0;
      setProgress(0);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
    };

    if (audioElement.readyState >= HTMLMediaElement.HAVE_METADATA && audioElement.currentSrc === episode.url) {
      handleMetadataLoaded();
    } else {
      setProgress(0);
      audioElement.addEventListener('loadedmetadata', handleMetadataLoaded);
    }

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleMetadataLoaded);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [episode]);

	useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Erro ao tentar reproduzir o áudio:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function handleSeek(amount: number) {
    if (!audioRef.current) return;

    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

	return (
		<div className={styles.playerContainer}>
			<header>
				<img src="/playing.svg" alt="Tocando agora" />
				<strong>Tocando agora {episode ? episode.title : ""}</strong>
			</header>

			{episode ? (
				<div className={styles.currentEpisode}>
					<Image
						width={592}
						height={592}
						src={episode.thumbnail}
						alt={episode.title}
					/>
					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>
			) : (
				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			)}

			<footer className={!episode ? styles.empty : ""}>
				<div className={styles.progress}>
					<span>{convertDurationToTimeString(progress)}</span>
					<div className={styles.slider}>
						{ episode ? (
							<Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
						) : (
							<div className={styles.emptySlider} />
						)}
					</div>
					<span>{episode ? convertDurationToTimeString(episode.duration) : '00:00'}</span>
				</div>

				{ episode && (
					<audio
						src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
					/>
				)}

				 <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length === 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ""}>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying
              ? <img src="/pause.svg" alt="Pausar"/>
              : <img src="/play.svg" alt="Tocar"/>
            }
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar proxima"/>
          </button>
          <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ""}>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
			</footer>
		</div>
	);
}
