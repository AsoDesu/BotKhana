import { Message, PermissionResolvable, TextChannel } from "discord.js";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class UnLinkCoordinator extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		let TALink = TALinkManager.GetTA(msg.guild.id);
		if (!TALink) {
			return ErrorEmbed("TA is disconnected", "Run ?reconnect to reconnect");
		}

		let Coordinator = TALink.LinkedCoordinators.find((c) => c.User.id == msg.author.id);

		if (!Coordinator) {
			return ErrorEmbed("Not linked", "You're not linked to a coordinator");
		}

		TALink.UnlinkCoordinator(Coordinator.Coordinator.Id);
		return SuccessEmbed("Unlinked Coordinator", `Unlinked you from TA`);
	}

	label = "unlink";
	Module = "Coordinator";

	description = "Unlinks you from TA";

	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
}

CommandManager.registerCommand(new UnLinkCoordinator());
