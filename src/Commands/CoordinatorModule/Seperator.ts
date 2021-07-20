import { Message, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Seperator extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		msg.delete()
        if (args.length === 0) {
            var stringArgs = "--"
        }
        else {
        var stringArgs = args.join(" ")
        }
        return msg.channel.send(`------------------------${stringArgs}------------------------`)
    }
	label = "seperator";
	aliases = ["seperate","sep"];
	description = "Posts a line seperator to help organise match text channels. Includes text in seperator line if provided.";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}
CommandManager.registerCommand(new Seperator());