import { Message } from "discord.js";
import CommandManager from "../Commands/CommandManager";

async function OnMessageRecived(e: Message) {
	if (!e.content.startsWith(process.env.PREFIX)) return;

	const args = e.content.toLowerCase().slice(process.env.PREFIX.length).split(/ +/);
	const command = args.shift().toLowerCase();

	CommandManager.executeCommand(command, e, args);
}

export default OnMessageRecived;
