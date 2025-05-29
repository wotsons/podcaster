export default interface Episode {
    id: number;
    title: string;
    members: string;
    published_at: string;
    description: string;
    file: {
        url: string;
        type: string;
        duration: number;
    };
    thumbnail: string;
}

export interface FormattedEpisode {
	id: number;
	title: string;
	thumbnail: string;
	members: string;
	published_at: string;
	duration: number;
	durationAsString: string;
	url: string;
	description: string;
}