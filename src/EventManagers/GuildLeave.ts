import { Guild } from "discord.js";
import Log from "../Utils/BotLogs/Log";

async function OnGuildLeave(g: Guild) {
	Log(`BotKhana left a server`, __filename);
	g.client.user.setActivity({ name: `${g.client.guilds.cache.size} servers`, type: "WATCHING" });
}

export default OnGuildLeave;
