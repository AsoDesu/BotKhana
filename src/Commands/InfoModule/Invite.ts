import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Invite extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		return new MessageEmbed({
			title: "BotKhana Invite",
			description:
				"You can use this bot for your own tournament, wheather they're on BeatKhana.com or not\n\n" +
				"[**Invite Bot**](https://discord.com/api/oauth2/authorize?client_id=796371697083219968&permissions=298265712&scope=bot)\n" +
				"[**BotKhana Support Server**](https://discord.gg/jEHVQajmS4)",
			color: "33A7FF",
			footer: {
				text: "Created by Aso#0001",
				iconURL: "https://scoresaber.com/imports/images/usr-avatars/76561198272266872.jpg",
			},
		});
	}
	label = "invite";
	description = "Get the BotKhana invite link along with the support discord";
	Module = "Info";
}

CommandManager.registerCommand(new Invite());
