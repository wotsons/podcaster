
import type { Episode, FormattedEpisode } from "@/types/Episodes";
import styles from "./styles.module.scss";

import { LatestEpisodesList } from "@/components/LatestEpisodesList";
import { AllEpisodesTableRow } from "@/components/AllEpisodesTableRow";
import { formatEpisodeData } from "@/utils/formatEpisodeData";

import { api } from "@/services/api";

async function getEpisodes(): Promise<{
	latestEpisodes: FormattedEpisode[];
	allEpisodes: FormattedEpisode[];
}> {
	try {
		const { data: episodesResponse } = await api.get<Episode[]>(
			"/episodes",
			{
				params: {
					_limit: 12,
					_sort: "published_at",
					_order: "desc",
				},
			},
		);

		if (episodesResponse && Array.isArray(episodesResponse)) {
			const formattedEpisodes = episodesResponse.map(formatEpisodeData);

			const latestEpisodes = formattedEpisodes.slice(0, 2);
			const allEpisodes = formattedEpisodes.slice(2, formattedEpisodes.length);
			return {
				latestEpisodes,
				allEpisodes,
			};
		}
		console.error(
			"A API não retornou episódios no formato esperado. Dados da resposta:",
			episodesResponse,
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
