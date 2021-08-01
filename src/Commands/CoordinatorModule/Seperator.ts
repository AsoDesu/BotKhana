import { Message, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Seperator extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		let CaseArgs = msg.content.slice(process.env.PREFIX.length).split(" ");
		CaseArgs.shift();

		msg.delete();
		if (args.length === 0) {
			var stringArgs = "--";
		} else {
			var stringArgs = " " + CaseArgs.join(" ") + " ";
		}
		return `------------------------${stringArgs}------------------------`;
	}
	label = "seperator";
	aliases = ["seperate", "sep"];
	Args = ["[(Text)]"];
	IgnoreArgs = true;
	description = "Posts a line seperator to help organise match text channels. Includes text in seperator line if provided.";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}
CommandManager.registerCommand(new Seperator());
