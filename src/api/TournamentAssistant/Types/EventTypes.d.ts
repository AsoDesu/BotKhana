import uuid from "uuid";
import VersionInfo from "../VersionInfo";
import { ServerState, Coordinator, Player, Match, PlayerBeatmap, PlayerData } from "./Types";

export interface Packet {
	Size: number;
	SpecificPacketSize: number;
	Id: string;
	From: string | "00000000-0000-0000-0000-000000000000";
	Type: number;
	SpecificPacket: any;
}

export interface UpdatePacket extends Packet {
	Type: 4;
	SpecificPacket: {
		Type: number;
		ChangedObject: any;
	};
}

export interface ConnectCoordinator {
	Size?: number;
	SpecificPacketSize?: number;
	Id?: string;
	From?: string;
	Type?: number;
	SpecificPacket?: { ClientType: 1; Name: string; UserId: string; ClientVersion: number; Password: string };
}

export interface CoordinatorResponse extends Packet {
	Type: 3;
	SpecificPacket: {
		Self: Coordinator | null;
		State: ServerState;
		ServerVersion: number;
		Type: number;
		Message: string;
	};
}

export interface PlayerConnect extends UpdatePacket {
	SpecificPacket: {
		Type: 0;
		ChangedObject: Player;
	};
}

// MATCH PACKET TYPES!!

export interface MatchCreate extends UpdatePacket {
	SpecificPacket: {
		Type: 5;
		ChangedObject: Match;
	};
}

export interface MatchUpdate extends UpdatePacket {
	SpecificPacket: {
		Type: 6;
		ChangedObject: Match;
	};
}

export interface MatchClose extends UpdatePacket {
	SpecificPacket: {
		Type: 7;
		ChangedObject: Match;
	};
}

// PLAYER PACKET TYPES!!

export interface PlayerConnect extends UpdatePacket {
	SpecificPacket: {
		Type: 1;
		ChangedObject: Player;
	};
}

export interface PlayerDisconnect extends UpdatePacket {
	SpecificPacket: {
		Type: 2;
		ChangedObject: Player;
	};
}

export interface PlayerCompleted extends Packet {
	Type: 13;
	SpecificPacket: PlayerData;
}

// COORDINATOR PACKET TYPES!!

export interface CoordinatorConnect extends UpdatePacket {
	SpecificPacket: { Type: 3; ChangedObject: Coordinator };
}

export interface CoordinatorDisconnect extends UpdatePacket {
	SpecificPacket: { Type: 4; ChangedObject: Coordinator };
}
