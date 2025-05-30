import { Lexend, Inter } from "next/font/google";
import "@/styles/global.scss";
import styles from "@/styles/layout.module.scss";
import { Header } from "@/components/Header";
import { Player } from "@/components/Player";

const lexend = Lexend({
	variable: "--font-lexend",
	display: "swap",
});

const inter = Inter({
	weight: "400",
	variable: "--font-inter",
	display: "swap",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className={`${lexend.variable} ${inter.variable}`}>
			<body>
				<div className={styles.wrapper}>
					<main>
						<Header />
						{children}
					</main>
					<Player />
				</div>
			</body>
		</html>
	);
}
