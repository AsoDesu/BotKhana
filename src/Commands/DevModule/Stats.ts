import { Message, MessageEmbed } from "discord.js";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import HexToDecimal from "../../Utils/HexToDecimal";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Ping extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		switch (args[0]) {
			case "guilds":
			case "servers":
				return SuccessEmbed("Servers", `BotKhana is in ${msg.client.guilds.cache.size} servers.`);
		}
	}

	label = "stats";
	hidden = true;
	description = "Get BotKhana's stats";
	Module = "Info";

	Args = ["Stat"];
}

CommandManager.registerCommand(new Ping());
