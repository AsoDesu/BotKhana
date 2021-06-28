import "dotenv/config";
import Discord from "discord.js";
import fs from "fs";
import SignupManager from "./api/BeatKhana/Manager/SignupManager";

// Event
import MessageRecived from "./EventManagers/MessageRecived";
import UserJoin from "./EventManagers/UserJoin";
import OnGuildJoin from "./EventManagers/GuildJoin";
import OnGuildLeave from "./EventManagers/GuildLeave";

// Command Manager
import CommandManager from "./Commands/CommandManager";

// Presence
import PresenceManager from "./Utils/PresenceManager";

// WebLink
import WebLink from "./Utils/WebLink";
import BotLogs from "./Utils/BotLogs/BotLogs";
import Log from "./Utils/BotLogs/Log";
import TournamentManager from "./DatabaseManager/TournamentManager";
import TALinkManager from "./api/TournamentAssistantManager/TALinkManager";

function GetCommandsInDir(dir: string) {
	fs.readdirSync(dir, { withFileTypes: true, encoding: "utf-8" }).forEach((file) => {
		if (file.isDirectory()) {
			GetCommandsInDir(dir + "/" + file.name);
			return;
		}
		require(`${dir}/${file.name}`);
	});
}

GetCommandsInDir(__dirname + "/Commands");

const Client = new Discord.Client();

Client.on("message", (e) => MessageRecived(e));
Client.on("guildCreate", (e) => OnGuildJoin(e));
Client.on("guildDelete", (e) => OnGuildLeave(e));
Client.on("guildMemberAdd", (e) => UserJoin(e));
Client.on("ready", async () => {
	console.log(`Connected to discord, ${CommandManager.commands.length} commands.`);
	PresenceManager.SetPresence();

	let Tournaments = await TournamentManager.GetAllTournaments();
	SignupManager.InitalizeAll(Tournaments);
	TALinkManager.InitalizeAll();

	await BotLogs.InitManager();
	Log("Connected to discord!", __filename);
});

Client.login(process.env.TOKEN);

WebLink();

export default () => Client;
