import { Guild } from "discord.js";

async function OnGuildJoin(g: Guild) {
	g.client.user.setActivity({ name: `${g.client.guilds.cache.size} servers`, type: "WATCHING" });
}

export default OnGuildJoin;
