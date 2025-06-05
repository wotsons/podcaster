/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './styles.module.scss'
import { api } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Episode, FormattedEpisode } from "@/types/Episodes";
import { formatEpisodeData } from '@/utils/formatEpisodeData';
import EpisodePlayerButton from '@/components/EpisodePlayerButton';

interface EpisodePageProps {
  params: {
    slug: string;
  };
}

async function getEpisodeData(slug: string): Promise<FormattedEpisode | null> {
  try {
    const { data } = await api.get<Episode>(`/episodes/${slug}`);

    if (!data) {
      console.warn(`Episódio com slug "${slug}" não encontrado na API.`);
      return null;
    }

    return formatEpisodeData(data);
  } catch (error) {
    console.error(`Erro ao buscar dados do episódio para o slug "${slug}":`, error);
    return null;
  }
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = params;
  const episode = await getEpisodeData(slug);

  if (!episode) {
    notFound();
  }

  return (
    <div className={styles.episode}>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button" aria-label="Voltar">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>

        <Image
          fill
          src={episode.thumbnail}
          alt={episode.title}
          priority
        />

        <EpisodePlayerButton episode={episode} />
      </div>

      <header className={styles.episodeHeader}>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.published_at}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <article
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const { data: episodes } = await api.get<Episode[]>("/episodes", {
      params: {
        _limit: 20,
        _sort: "published_at",
        _order: "desc",
      },
    });

    if (!episodes || !Array.isArray(episodes)) {
      console.warn("Nenhum episódio retornado para generateStaticParams ou os dados não são um array.");
      return [];
    }

    return episodes.map((episode) => ({
      slug: episode.title,
    }));
  } catch (error) {
    console.error("Erro ao buscar episódios para generateStaticParams:", error);
    return [];
  }
}

export const revalidate = 60 * 60 * 24;