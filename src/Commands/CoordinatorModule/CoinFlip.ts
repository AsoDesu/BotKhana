import { Message, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class CoinFlip extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (Math.random() === 0) {
            return ("Heads")
        }
        else {
            return ("Tails")
        }
	}
	label = "coinflip";
	aliases = ["coin"];
	description = "Flips a coin";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}
CommandManager.registerCommand(new CoinFlip());
