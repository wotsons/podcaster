import React from 'react';
import styles from './styles.module.scss'
import { api } from '@/services/api';
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from '@/utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Episode, FormattedEpisode } from "@/types/Episodes";
import { GetStaticPaths } from 'next';

interface EpisodePageProps {
  params:  Promise<{
    slug: string;
  }>;
}

async function getEpisodeData(slug: string): Promise<FormattedEpisode | null> {
  try {
    const { data } = await api.get<Episode>(`/episodes/${slug}`);

    if (!data) {
      console.warn(`Episódio com slug "${slug}" não encontrado na API.`);
      return null;
    }

    const episode: FormattedEpisode = {
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      members: data.members,
      published_at: format(parseISO(data.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(data.file.duration),
      ),
      url: data.file.url,
      description: data.description,
    };

    return episode;
  } catch (error) {
    console.error(`Erro ao buscar dados do episódio para o slug "${slug}":`, error);
    return null;
  }
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
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

        <button type="button" aria-label="Tocar episódio">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
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