import { Message, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import CommandManager from "../CommandManager";

class PickNumber extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (args[0] === "0") {
			return ErrorEmbed("Bad Argument","I can't get a random number between 0 and 0!\n*That's a lie, the random number is 0*")
		}
		return Math.floor(Math.random() * (parseInt(args[0]) - 0) + 0);
    }
	label = "picknumber";
	aliases = ["pn"];
	description = "Picks a random number between 0 and the number given";
    RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordination";
}
CommandManager.registerCommand(new PickNumber());