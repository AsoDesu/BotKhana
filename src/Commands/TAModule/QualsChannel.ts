import { Message, PermissionResolvable } from "discord.js";
import GuildManager from "../../DatabaseManager/GuildManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class QualsChannel extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (msg.mentions.channels.size == 0) {
			return ErrorEmbed("Incorrect Argument", "You need to provide a Text Channel");
		}

		let Channel = msg.mentions.channels.first();
		if (Channel.type != "text") {
			return ErrorEmbed("Incorrect Argument", "You need to provide a Text Channel");
		}

		GuildManager.Set(msg.guild.id, { qualsChannel: Channel.id });
		return SuccessEmbed("Set Qualifer Channel", `Qualifer results will now be sent to <#${Channel.id}>`);
	}

	label = "setqualschannel";
	aliases = ["setquals"];
	Args = ["(Channel)"];
	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;
}

CommandManager.registerCommand(new QualsChannel());
