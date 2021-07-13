import { Message } from "discord.js";
import CommandManager from "../Commands/CommandManager";
import ErrorEmbed from "../Utils/Embeds/ErrorEmbed";

async function OnMessageRecived(e: Message) {
	if (!e.guild) {
		e.channel.send(ErrorEmbed("You can't do that here.", `You cannot run commands in dm.`));
		return;
	}

	if (!e.content.startsWith(process.env.PREFIX)) return;

	const args = e.content.toLowerCase().slice(process.env.PREFIX.length).split(/ +/);
	const command = args.shift().toLowerCase();

	CommandManager.executeCommand(command, e, args);
}

export default OnMessageRecived;
