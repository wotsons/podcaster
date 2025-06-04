
import type { Episode, FormattedEpisode } from "@/types/Episodes";
import {convertDurationToTimeString} from "@/utils/convertDurationToTimeString";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import styles from "./styles.module.scss";

import { LatestEpisodesList } from "@/components/LatestEpisodesList";
import { AllEpisodesTableRow } from "@/components/AllEpisodesTableRow";

import { api } from "@/services/api";

async function getEpisodes(): Promise<{
	latestEpisodes: FormattedEpisode[];
	allEpisodes: FormattedEpisode[];
}> {
	try {
		const { data: EpisodesResponse } = await api.get<Episode>(
			"/episodes",
			{
				params: {
					_limit: 12,
					_sort: "published_at",
					_order: "desc",
				},
			},
		);

		if (EpisodesResponse && Array.isArray(EpisodesResponse)) {
			const formattedEpisodes = EpisodesResponse.map((episode) => {
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
			});

			const latestEpisodes = formattedEpisodes.slice(0, 2);
			const allEpisodes = formattedEpisodes.slice(2, formattedEpisodes.length);

			return {
				latestEpisodes,
				allEpisodes,
			};
		}
		console.error(
			"API did not return episodes in the expected format. Response data:",
			EpisodesResponse,
		);
		return { latestEpisodes: [], allEpisodes: [] };
	} catch (error) {
		console.error("Error fetching episodes:", error);
		return { latestEpisodes: [], allEpisodes: [] };
	}
}

export default async function Home() {
  const { latestEpisodes, allEpisodes } = await getEpisodes();

	return (
		<div className={styles.homepage}>
			<section className={styles.latestEpisodes}>
				<h2>
					Últimos lançamentos
				</h2>

				<LatestEpisodesList latestEpisodes={latestEpisodes} />

			</section>

			<section className={styles.allEpisodes}>
				<h2>Todos os episódios</h2>

				<table cellSpacing={0}>
					<thead>
						<tr>
							<th />
							<th>Podcast</th>
							<th>Integrantes</th>
							<th>Data</th>
							<th>Duração</th>
							<th />
						</tr>
					</thead>

					<tbody>
						{allEpisodes.map((episode, index) => (
							<AllEpisodesTableRow
								key={episode.id}
								episode={episode}
								allEpisodes={allEpisodes}
								index={index}
							/>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
}
