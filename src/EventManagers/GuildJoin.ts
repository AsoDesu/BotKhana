import { Guild } from "discord.js";
import Log from "../Utils/BotLogs/Log";

async function OnGuildJoin(g: Guild) {
	Log(`BotKhana joined new server`, __filename);
}

export default OnGuildJoin;
