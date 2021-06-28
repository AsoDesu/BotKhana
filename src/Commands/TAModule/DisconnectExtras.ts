import { Message, PermissionResolvable } from "discord.js";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";
import GuildManager from "../../DatabaseManager/GuildManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class DisconnectExtras extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		let TAManager = TALinkManager.GetTA(msg.guild.id);
		if (!TAManager) {
			return ErrorEmbed("TA is disconnected", "Run ?reconnect to reconnect");
		}

		TAManager.Client.DisconnectExtras();
		return SuccessEmbed("Disconnected Extras", "Disconnected the BotKhana coordinators which didn't want to leave TA");
	}

	label = "disconnectextras";
	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;

	description = "Removes any extra `BotKhana` coordinators left in TA";

	Module = "Tournament Assistant";
}

CommandManager.registerCommand(new DisconnectExtras());
