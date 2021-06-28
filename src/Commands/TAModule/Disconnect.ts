import { Message, PermissionResolvable } from "discord.js";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";
import GuildManager from "../../DatabaseManager/GuildManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class DisconnectCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		let GuildData = await GuildManager.Get(msg.guild.id);

		if (!GuildData.ta_ip) {
			return ErrorEmbed("TA isn't linked", "TA isn't linked run ?connect (TA IP:PORT) [(PASSWORD)] to connect.");
		}

		let TAManager = TALinkManager.GetTA(msg.guild.id);
		if (!TAManager) {
			return ErrorEmbed("TA is disconnected", "Run ?reconnect to reconnect");
		}

		msg.channel.send(SuccessEmbed("Disconnected from TA", "Run ?reconnect to reconnect"));

		TAManager.Client.Disconnect();
		TALinkManager.UnlinkTA(msg.guild.id);
	}

	label = "disconnect";
	Module = "Tournament Assistant";

	description = "Disconnects TA from your discord";

	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;
}

CommandManager.registerCommand(new DisconnectCommand());
