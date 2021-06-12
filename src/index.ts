import "dotenv/config";
import Discord from "discord.js";
import fs from "fs";
import SignupManager from "./BeatKhanaApi/Manager/SignupManager";

// Event
import MessageRecived from "./EventManagers/MessageRecived";

// Command Manager
import CommandManager from "./Commands/CommandManager";
import UserJoin from "./EventManagers/UserJoin";
import OnGuildJoin from "./EventManagers/GuildJoin";

// Presence
import PresenceManager from "./Utils/PresenceManager";

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
Client.on("guildMemberAdd", (e) => UserJoin(e));

Client.on("ready", () => {
	console.log(`Connected to discord, ${CommandManager.commands.length} commands.`);

	PresenceManager.SetPresence();

	SignupManager.InitalizeAll();
});

Client.login(process.env.TOKEN);

export default () => Client;
