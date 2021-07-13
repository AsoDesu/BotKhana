import { Guild } from "discord.js";
import GuildManager from "../../DatabaseManager/GuildManager";
import Client from "../../index";
import TAManager from "./TAManager";

var TAManagers: TAManager[] = [];

async function InitalizeAll() {
	let Guilds = await GuildManager.GetAll();
	Guilds.forEach((g) => {
		if (!g.ta_ip) return;

		let Guild = Client().guilds.cache.get(g.guildId);
		if (!Guild) return;

		LinkTA(Guild, g.ta_ip, g.ta_password ? g.ta_password : "");
	});
}

function LinkTA(Guild: Guild, ip: string, password: string) {
	let Manager = new TAManager(ip, password, Guild);
	TAManagers.push(Manager);
	return Manager;
}

function GetTA(GuildID: string) {
	return TAManagers.find((t) => t.Guild.id == GuildID);
}

function UnlinkTA(GuildID: string) {
	let i = TAManagers.findIndex((t) => t.Guild.id == GuildID);
	if (i == -1) return 0;
	TAManagers.splice(i, 1);
	return;
}

export default {
	LinkTA,
	GetTA,
	InitalizeAll,
	UnlinkTA,
	TAManagers,
};
