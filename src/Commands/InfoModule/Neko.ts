import { Message, MessageEmbed } from "discord.js";
import got from "got";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Invite extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var data = JSON.parse((await got("https://nekos.life/api/v2/img/neko")).body);
		return data.url;
	}
	label = "neko";
	hidden = true;
}

CommandManager.registerCommand(new Invite());
