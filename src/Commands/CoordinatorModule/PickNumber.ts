import { Message, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import CommandManager from "../CommandManager";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";

class PickNumber extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (args[0] == "0") {
			return ErrorEmbed("Bad Argument", "I can't get a random number between 0 and 0!\n*That's a lie, the random number is 0*");
		}
		return SuccessEmbed("Random Number", Math.round(Math.random() * parseInt(args[0])).toString());
	}
	label = "picknumber";
	aliases = ["pn"];
	Args = ["(Number)"];
	description = "Picks a random number between 0 and the number given";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordination";
}
CommandManager.registerCommand(new PickNumber());
