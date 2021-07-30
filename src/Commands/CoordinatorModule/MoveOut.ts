import { Message, PermissionResolvable } from "discord.js";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import GuildManager from "../../DatabaseManager/GuildManager";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class MoveOut extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.voice.channel) {
			return ErrorEmbed("You're not in a Voice channel", "You have to be in a Voice channel to run that command.");
		}
		let GuildData = await GuildManager.Get(msg.guild.id);
		if (!GuildData.lobbyVC) {
			return ErrorEmbed("LobbyVC not defined", "You need to set the lobby vc. run the command ?setlobby");
		}

		let MovedMembers = 0;
		let failedMembers = "";

		for (let [id, member] of msg.member.voice.channel.members) {
			if (member.id == msg.author.id) continue;
			try {
				await member.voice.setChannel(GuildData.lobbyVC, `Moved to lobby VC as requested by ${msg.author.username}`);
				MovedMembers++;
			} catch {
				failedMembers = failedMembers.concat(member.user.username + ", ");
			}
		}

		if (failedMembers) {
			// Embed can probably be restructed to look nicer
			return ErrorEmbed("Failed to move some users", `Failed to move: ${failedMembers.slice(0, -2)}\nCheck that they're connected to a voice channel!`);
		}
		return SuccessEmbed("Successfully moved users", `Successfuly moved ${MovedMembers} user${MovedMembers != 1 ? "s" : ""} to <#${GuildData.lobbyVC}>`);
	}
	label = "moveout";
	aliases = ["mo"];
	description = "Moves users in your voice channel to the lobby voice channel";
	RequiredPermission = "MOVE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}
CommandManager.registerCommand(new MoveOut());
