import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class FAQ extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		msg.channel.send(
			new MessageEmbed({
				title: "FAQ",
				color: "33A7FF",
				fields: [
					{ name: "Signups aren't linking", value: "Make sure that you have `Publicly Show Signups` enabled in BeatKhana Tournament Settings" },
					{
						name: "How do I get my tournament Id?",
						value: "Your Tournament ID is the numbers at the end of your BeatKhana URL, e.g. `https://beatkhana.com/tournament/2147484236` -> `2147484236`",
					},
				],
			})
		);
	}

	label = "faq";
}

CommandManager.registerCommand(new FAQ());
