import { Message, PermissionResolvable } from "discord.js";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class CoinFlip extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (Math.round(Math.random()) == 0) {
			return SuccessEmbed("The coin landed", `Heads!`);
		} else {
			return SuccessEmbed("The coin landed", `Tails!`);
		}
	}
	label = "coinflip";
	aliases = ["coin"];
	description = "Flips a coin";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}
CommandManager.registerCommand(new CoinFlip());
