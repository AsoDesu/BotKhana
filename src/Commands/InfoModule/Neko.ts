import { Message } from "discord.js";
import got from "got";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import nekos from "nekos.life";

let Neko = new nekos();

class Invite extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		let url = "";
		switch (args[0]) {
			case "poke":
				url = (await Neko.sfw.poke()).url;
				break;
			case "slap":
				url = (await Neko.sfw.slap()).url;
				break;
			case "hug":
				url = (await Neko.sfw.hug()).url;
				break;
			case "pat":
				url = (await Neko.sfw.pat()).url;
				break;
			default:
				url = (await Neko.sfw.neko()).url;
				break;
		}
		return url;
	}
	label = "neko";
	hidden = true;
}

CommandManager.registerCommand(new Invite());
