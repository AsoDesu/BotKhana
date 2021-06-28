import { Message, PermissionResolvable, TextChannel } from "discord.js";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class LinkCoordinator extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		let TALink = TALinkManager.GetTA(msg.guild.id);
		if (!TALink) {
			return ErrorEmbed("TA is disconnected", "Run ?reconnect to reconnect");
		}

		let Coordinator = TALink.Client.Coordinators.find((c) => c.Name.toLowerCase() == args[0]);
		if (!Coordinator) {
			return ErrorEmbed("Coordinator Not Found", "We couldn't find that coordinator");
		}

		TALink.LinkCoordinator(msg.member, msg.channel as TextChannel, Coordinator.Id);
		return SuccessEmbed("Linked Coordinator", `Linked Coordinator **${Coordinator.Name}** to User <@${msg.member.id}> and Matchroom <#${msg.channel.id}>`);
	}

	label = "link";
	Module = "Coordinator";
	Args = ["(Coordinator Name)"];

	description = "Links you to a TA coordinator and matchroom";

	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
}

CommandManager.registerCommand(new LinkCoordinator());
