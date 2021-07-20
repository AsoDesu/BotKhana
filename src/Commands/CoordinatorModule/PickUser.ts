import { Message, PermissionResolvable } from "discord.js";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class PickUser extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.voice.channel) {
			return ErrorEmbed("You're not in a Voice channel", "You have to be in a Voice channel to run that command.");
		}
		var Users = msg.member.voice.channel.members
		Users.delete(msg.author.id)
		let keys = Array.from(Users.keys());
		if (keys.length === 0) {
			return ErrorEmbed("You're alone!", "You can't run this command in a voice channel by yourself.");
		}
		let key = keys[Math.floor(Math.random() * keys.length)];
		return (Users.get(key))["user"]["username"]
    }
	label = "pickuser";
	aliases = ["pu"];
	description = "Picks a random user in your voice channel excluding yourself";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	Module = "Coordinator";
}
CommandManager.registerCommand(new PickUser());