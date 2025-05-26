import { Header } from "@/components/Header";
import { Player } from "@/components/Player";

import styles from "@/styles/page.module.scss";

export default function Home() {
	return (
		<div className={styles.wrapper}>
			<main>
				<Header />
				<h1>page</h1>
			</main>
			<Player />
		</div>
	);
}
