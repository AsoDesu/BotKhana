import { Message, PermissionResolvable } from "discord.js";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class MoveIn extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.voice.channel) {
			return ErrorEmbed("You're not in a Voice channel", "You have to be in a Voice channel to run that command.");
		}

		let failedMembers = "";
		let MovedMembers = 0;
		for (let [id, member] of msg.mentions.members) {
			// could be improved to allow for IDs or usernames instead of just mentions
			try {
				await member.voice.setChannel(msg.member.voice.channel, `Moved to ${member.voice.channel.name} VC as requested by ${msg.author.username}`);
				MovedMembers++;
			} catch {
				failedMembers = failedMembers.concat(member.user.username + ", ");
			}
		}

		if (failedMembers) {
			// Embed can probably be restructed to look nicer
			return ErrorEmbed("Failed to move some users", `Failed to move: ${failedMembers.slice(0, -2)}\nCheck that they're connected to a voice channel!`);
		}
		return SuccessEmbed("Successfully moved users", `Successfuly moved ${MovedMembers} user${MovedMembers != 1 ? "s" : ""} to <#${msg.member.voice.channel.id}>`);
	}
	label = "movein";
	aliases = ["mi"];
	description = "Moves mentioned users into your voice channel";
	RequiredPermission = "MOVE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}
CommandManager.registerCommand(new MoveIn());
