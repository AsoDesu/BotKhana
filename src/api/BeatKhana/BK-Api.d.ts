interface tournament {
	tournamentId: number;
	name: string;
	image: string;
	startDate: string;
	endDate: string;
	discord: string;
	twitchLink: string;
	prize: string;
	info: string;
	owner: string;
	archived: number;
	first: null;
	second: null;
	third: null;
	is_mini: number;
	settingsId: number;
	public_signups: number;
	public: number;
	state: string;
	type: string;
	has_bracket: number;
	has_map_pool: number;
	signup_comment: string;
	comment_required: number;
	show_signups: number;
	bracket_sort_method: string;
	bracket_limit: number;
	quals_cutoff: number;
	show_quals: number;
	has_quals: number;
	countries: string;
	sort_method: string;
	standard_cutoff: number;
	qual_attempts: number;
	quals_method: string;
	ta_url: string;
}

interface user {
	discordId: string;
	ssId: string;
	name: string;
	twitchName: string;
	avatar: string;
	globalRank: number;
	localRank: number;
	country: string;
	tourneyRank: number;
	TR: number;
	pronoun: string;
}

interface staff_user extends user {
	roles: role[];
}

interface role {
	id: 1 | 2 | 3;
	role: "Admin" | "Map Pool" | "Coordinator";
}

interface bracketMatch {
	id: number;
	status: string;
	matchNum: number;
	tournamentId: string;
	p1: {
		id: string;
		name: string;
		avatar: string;
		score: number;
		country: string;
		seed: number;
		twitch: string;
		rank: number;
	};
	p2: {
		id: string;
		name: string;
		avatar: string;
		score: number;
		country: string;
		seed: number;
		twitch: string;
		rank: number;
	};
	round: number;
	bye: number;
	time: string;
	best_of: number;
}

interface pool {
	id: number;
	tournamentId: number;
	poolName: string;
	image: string;
	description: string;
	live: true;
	is_qualifiers: number;
	songs: [
		{
			id: number;
			hash: string;
			name: string;
			songAuthor: string;
			levelAuthor: string;
			diff: string;
			key: string;
			ssLink: string;
			numNotes: number;
		}
	];
}

interface pools {
	[key: string]: pool;
}

interface newParticipant {
	newParticipant: {
		tournamentId: number;
		comment: string;
		userId: string;
	};
}

interface participant extends user {
	comment: string;
	forfeit: number;
	participantId: number;
	position: number;
	seed: number;
	tourneyRank: number;
	TR: number;
	userId: string;
}

export type { role, staff_user, tournament, user, bracketMatch, pools, pool, newParticipant, participant };
