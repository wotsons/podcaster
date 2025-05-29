import Home from "@/app/home";
import { Header } from "@/components/Header";
import { Player } from "@/components/Player";
import { api } from "@/services/api";
import type EpisodesResponse from "@/types/Episodes";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { convertDurationToTimeString } from "@/components/utils/convertDurationToTimeString";

import styles from "@/styles/page.module.scss";
import type { FormattedEpisode } from "@/types/Episodes";

async function getEpisodes(): Promise<{
	latestEpisodes: FormattedEpisode[];
	allEpisodes: FormattedEpisode[];
}> {
	try {
		const { data: EpisodesResponse } = await api.get<EpisodesResponse>(
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

export default async function Page() {
	const episodes = await getEpisodes();

	return (
		<div className={styles.wrapper}>
			<main>
				<Header />
				<Home
					{...episodes}
				/>
			</main>
			<Player />
		</div>
	);
}

export const revalidate = 60 * 60 * 8; // 8 hours
