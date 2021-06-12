import { Message } from "discord.js";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Eval extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (msg.author.id != "580425653325791272") return;

		var result;
		try {
			result = SuccessEmbed("Eval Success", await eval(msg.content.replace(`${process.env.PREFIX}eval `, "").replace(/`/g, "")));
		} catch (e) {
			result = ErrorEmbed("Eval Error", e);
		}

		return result;
	}

	label = "eval";
	hidden = true;
}

CommandManager.registerCommand(new Eval());
