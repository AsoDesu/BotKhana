import { Message } from "discord.js";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";
import DisconnectCoordinatorPacket from "../../api/TournamentAssistant/Packets/DisconnectCoordinator";
import { DisconnectCoordinator } from "../../api/TournamentAssistant/Types/EventTypes";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class test extends BaseCommand {
	async execute(msg: Message, args: string[]) {}

	label = "test";
	hidden = true;
}

CommandManager.registerCommand(new test());
