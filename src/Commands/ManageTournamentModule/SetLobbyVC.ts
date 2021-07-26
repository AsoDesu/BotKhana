import { Message, PermissionResolvable } from "discord.js";
import GuildManager from "../../DatabaseManager/GuildManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class SyncCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.voice.channel) {
			return ErrorEmbed("You have to be in a VC to run this command", "Please join the vc you want to set as your lobby vc, and run this command again.");
		}
		let channel = msg.member.voice.channel;
		await GuildManager.Set(msg.guild.id, { lobbyVC: channel.id });
		return SuccessEmbed("Set Lobby VC", `Set this servers lobby VC to be <#${channel.id}>`);
	}

	label = "setlobby";
	description = "Set the Lobby (Waiting for Match) VC.";
	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;

	Module = "Coordinator";
}

CommandManager.registerCommand(new SyncCommand());
