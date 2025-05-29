import type { FormattedEpisode } from "@/types/Episodes";
import styles from "./styles.module.scss";

import Image from "next/image";

interface HomeProps {
	latestEpisodes: FormattedEpisode[];
	allEpisodes: FormattedEpisode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
	return (
		<div className={styles.homepage}>
			<section className={styles.latestEpisodes}>
				<h2>
					Últimos lançamentos
					<p>testesteste</p>
				</h2>

				<ul>
					{latestEpisodes.map((episodes) => {
						return (
							<li key={episodes.id}>
								<Image
									width={192}
									height={192}
									src={episodes.thumbnail}
									alt={episodes.title}
									objectFit="cover"
								/>

								<div className={styles.episodeDetails}>
									<a href="teste">{episodes.title}</a>
									<p>{episodes.members}</p>

									<span>{episodes.published_at}</span>
									<span>{episodes.durationAsString}</span>
								</div>

								<button type="button">
									<Image
										width={30}
										height={30}
										src="/play-green.svg"
										alt="Tocar episódio"
										objectFit="cover"
									/>
								</button>
							</li>
						);
					})}
				</ul>
			</section>

			<section className={styles.allEpisodes}>
				<h2>Todos os episódios</h2>

				<table cellSpacing={0}>
					<thead>
						<th />
						<th>Podcast</th>
						<th>Integrantes</th>
						<th>Data</th>
						<th>Duração</th>
						<th/>
					</thead>

					<tbody>
						{allEpisodes.map((episodes) => {
							return (
								<tr key={episodes.id}>
									<td style={{ width: 100}}>
										<Image
											width={120}
											height={120}
											src={episodes.thumbnail}
											alt={episodes.title}
											objectFit="cover"
										/>
									</td>
									<td>
										<a href="">{episodes.title}</a>
									</td>
									<td>{episodes.members}</td>
									<td style={{ width: 100}}>{episodes.published_at}</td>
									<td>{episodes.durationAsString}</td>

									<td>
										<button type="button">
											<Image
												width={30}
												height={30}
												src="/play-green.svg"
												alt="Tocar episódio"
												objectFit="cover"
											/>
										</button>
									</td>

								</tr>);
						})}
					</tbody>
				</table>

			</section>
		</div>
	);
}
