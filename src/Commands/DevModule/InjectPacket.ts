import { Message } from "discord.js";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Inject extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (msg.author.id != "580425653325791272") return;

		TALinkManager.GetTA(msg.guild.id).Client.InjectPacket(msg.content.replace(`${process.env.PREFIX}inject `, "").replace(/`/g, ""));

		return "Injected Packet.";
	}

	label = "inject";
	hidden = true;
}

CommandManager.registerCommand(new Inject());
