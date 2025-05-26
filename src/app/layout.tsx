import { Lexend, Inter } from "next/font/google";
import "@/styles/global.scss";

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
			<body>{children}</body>
		</html>
	);
}
