import { Guild } from "discord.js";
import Log from "../Utils/BotLogs/Log";

async function OnGuildLeave(g: Guild) {
	Log(`BotKhana left a server`, __filename);
}

export default OnGuildLeave;
