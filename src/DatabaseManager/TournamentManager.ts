import db from "./DatabaseInit";
import { firestore } from "firebase-admin";

interface TournamentData {
	guildId?: string;
	signupRole?: string;
	signupsChannel?: string;
	syncSignups?: boolean;
	showComment?: boolean;
	tournamentId?: string;
	tournamentName?: string;
	updateBracketButton?: boolean;
}

async function SetData(id: string, data: TournamentData) {
	return await db.collection("tournaments").doc(id).set(data, { merge: true });
}

async function GetData(id: string) {
	let result = await db.collection("tournaments").doc(id).get();
	if (!result.exists) return null;
	return result.data() as TournamentData;
}

async function GetDataFromGuildId(id: string) {
	let results = await db.collection("tournaments").where("guildId", "==", id).get();
	return results.docs.map((d) => d.data()) as TournamentData[];
}

async function GetAllTournaments() {
	let results = await db.collection("tournaments").get();
	return results.docs.map((d) => d.data()) as TournamentData[];
}

async function Remove(id: string) {
	return await db.collection("tournaments").doc(id).delete();
}

export default {
	SetData,
	GetData,
	Remove,
	GetDataFromGuildId,
	GetAllTournaments,
};

export type { TournamentData };
