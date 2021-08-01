import { Message, MessageEmbed } from "discord.js";
import HexToDecimal from "../../Utils/HexToDecimal";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Ping extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var client = msg.client;
		var ping = Date.now() - msg.createdTimestamp;
		return new MessageEmbed({
			title: "Pong!",
			description: `:ping_pong: ${client.user.username}'s ping is ${ping}ms.`,
			color: GeneratePingValue(ping),
		});
	}

	label = "ping";
	description = "Get BotKhana's current ping";
	Module = "Info";
}

function GeneratePingValue(ping: number) {
	if (ping <= 150) {
		return HexToDecimal("33ff58");
	} else if (ping <= 300) {
		return HexToDecimal("ffaa33");
	} else {
		return HexToDecimal("ff3333");
	}
}

CommandManager.registerCommand(new Ping());
