import { Message, PermissionResolvable } from "discord.js";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import bk from "../../api/BeatKhana/BK-Api";

class MultiStream extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.voice.channel) {
			return ErrorEmbed("You're not in a Voice channel", "You have to be in a Voice channel to run that command.");
		}

		var MultiStreamLink = "https://multistre.am";
		for (let [id, u] of msg.member.voice.channel.members) {
			if (u.id == msg.author.id) continue;
			var User = await bk.User(u.id);
			MultiStreamLink = MultiStreamLink.concat("/" + User["twitchName"]);
		}
		return MultiStreamLink;
	}
	label = "multistream";
	aliases = ["ms"];
	description = "Generates a Multistream link with the users in your current Voice Channel except yourself";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}
CommandManager.registerCommand(new MultiStream());
