export interface Coordinator {
	GetIcon: string;
	UserId: string | null;
	Id: string;
	Name: string;
}

export interface ServerState {
	ServerSettings: {
		ServerName: string;
		Password: string;
		EnableTeams: boolean;
		Teams: [
			{
				Id: string;
				Name: string;
			}
		];
		ScoreUpdateFrequency: number;
		BannedMods: string;
	};
	Players: Player[];
	Coordinators: Coordinator[];
	Matches: Match[];
	Events: Event[];
	KnownHosts: [
		{
			Name: string;
			Address: string;
			Port: string;
		}
	];
	ServerVersion: number;
	Type: 0 | 1;
	Message: string;
}

export interface Player {
	UserId: string;
	Team: {
		Id: string;
		Name: string;
	};
	PlayState: 0 | 1;
	DownloadState: 0 | 1 | 2;
	Score: number;
	Combo: number;
	Accuracy: number;
	SongPosition: number;
	SongList: null | any;
	ModList: string[] | null;
	StreamScreenCoordinates: {
		x: number;
		y: number;
	};
	StreamDelayMs: number;
	StreamSyncStartMs: number;
	Id: string;
	Name: string;
}

export interface Match {
	Guid: string;
	Players: Player[];
	Leader: Coordinator;
	SelectedLevel: Level;
	SelectedCharacteristic: Characteristic;
	SelectedDifficulty: 0 | 1 | 2 | 3 | 4;
}

export type DifficultyNumber = 0 | 1 | 2 | 3 | 4;

export interface Characteristic {
	SerializedName: "360Degree" | "90Degree" | "Lawless" | "Lightshow" | "NoArrows" | "OneSaber" | "Standard";
	Difficulties: number[];
}

export interface Level {
	LevelId: string;
	Name: string;
	Characteristics: Characteristic[];
	Loaded: boolean;
}

export interface PlayerBeatmap {
	Name: string | null;
	LevelId: string;
	Characteristic: Characteristic;
	Difficulty: DifficultyNumber;
}

export interface PlayerData {
	User: Player;
	Beatmap: PlayerBeatmap;
	Type: number;
	Score: number;
}

export interface QualiferMap {
	Beatmap: PlayerBeatmap;
	PlayerSettings: {
		PlayerHeight: number;
		SfxVolume: number;
		SaberTrailIntensity: number;
		NoteJumpStartBeatOffset: number;
		Options: number;
	};
	GameplayModifiers: {
		Options: number;
	};
}

export interface Event {
	EventId: string;
	Name: string;
	Guild: {
		Id: number;
		Name: string;
	};
	InfoChannel: {
		Id: number;
		Name: string;
	};
	QualifierMaps: QualiferMap[];
	SendScoresToInfoChannel: boolean;
	Flags: number;
}

export interface Score {
	EventId: string;
	Parameters: QualiferMap;
	UserId: number;
	Username: string;
	_Score: number;
	FullCombo: false;
	Color: string;
}
