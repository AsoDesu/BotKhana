import db from "./DatabaseInit";

export interface GuildData {
	ta_ip?: string;
	ta_password?: string;
	matchroomChannels?: string[];
	guildId?: string;
	lobbyVC?: string;
}

async function Set(id: string, data: GuildData) {
	data.guildId = id;
	return await db.collection("guilds").doc(id).set(data, { merge: true });
}

async function Get(id: string) {
	let result = await db.collection("guilds").doc(id).get();
	if (!result.exists) return null;
	return result.data() as GuildData;
}

async function GetAll() {
	let results = await db.collection("guilds").get();
	return results.docs.map((g) => g.data()) as GuildData[];
}

async function Remove(id: string) {
	return await db.collection("guilds").doc(id).delete();
}

export default {
	Set,
	Get,
	GetAll,
	Remove,
};
