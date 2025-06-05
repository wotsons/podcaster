import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "./convertDurationToTimeString";
import type { Episode, FormattedEpisode } from "@/types/Episodes";

export function formatEpisodeData(episode: Episode): FormattedEpisode {
  return {
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    published_at: format(parseISO(episode.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(episode.file.duration),
    ),
    url: episode.file.url,
    description: episode.description,
  };
}