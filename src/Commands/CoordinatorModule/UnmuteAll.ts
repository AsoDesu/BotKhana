import { Message, PermissionResolvable } from "discord.js";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class MuteAll extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.voice.channel) {
			return ErrorEmbed("You're not in a Voice channel", "You have to be in a Voice channel to run that command.");
		}

		msg.member.voice.channel.members.forEach((u) => {
			if (u.id == msg.author.id) return;
			u.voice.setMute(false);
		});
		return SuccessEmbed("Unmuted Members", `Unmuted all members in ${msg.member.voice.channel.name}. Remeber to mute yourself`);
	}

	label = "unmuteall";
	aliases = ["ua"];
	description = "Unmute every member in your current Voice Channel except yourself";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}

CommandManager.registerCommand(new MuteAll());
