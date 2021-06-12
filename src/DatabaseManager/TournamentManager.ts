import db from "./DatabaseInit";
import { firestore } from "firebase-admin";

interface TournamentData {
	guildId?: string;
	signupRole?: string;
	coordinatorRole?: string;
	signupsChannel?: string;
	qualifersChannel?: string;
	tournamentAssistant?: {
		ip?: string;
		password?: string;
	};
	tournamentId?: string;
	tournamentName?: string;
}

async function SetData(id: string, data: TournamentData) {
	var result = await db.collection("tournaments").doc(id).set(data, { merge: true });
	return result;
}

async function GetData(id: string) {
	var result = await db.collection("tournaments").doc(id).get();
	if (!result.exists) return null;
	return result.data() as TournamentData;
}

async function GetDataFromGuildId(id: string) {
	var results = await db.collection("tournaments").where("guildId", "==", id).get();
	return results.docs.map((d) => d.data()) as TournamentData[];
}

async function GetAllTournaments() {
	var results = await db.collection("tournaments").get();
	return results.docs.map((d) => d.data()) as TournamentData[];
}

async function Remove(id: string) {
	var result = await db.collection("tournaments").doc(id).delete();
	return result;
}

export default {
	SetData,
	GetData,
	Remove,
	GetDataFromGuildId,
	GetAllTournaments,
};

export type { TournamentData };
