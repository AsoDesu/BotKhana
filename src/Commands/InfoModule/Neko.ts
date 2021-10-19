import { Message } from "discord.js";
import got from "got";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import nekos from "nekos.life";
import NoPerms from "../../Utils/Embeds/Presets/NoPerms";
import GuildManager from "../../DatabaseManager/GuildManager";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import GetDefaultTrue from "../../Utils/GetDefaultTrue";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";

let Neko = new nekos();

class Invite extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		let url = "";

		if (args[0] != "disable" && args[0] != "enable") {
			if (!GetDefaultTrue((await GuildManager.Get(msg.guild.id)).nekos)) {
				return ErrorEmbed("Nekos are disabled", "This server has disabled ?neko... :(");
			}
		}

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
			case "disable":
				if (!msg.member.hasPermission("MANAGE_GUILD")) {
					return NoPerms();
				}
				GuildManager.Set(msg.guild.id, { nekos: false });
				return SuccessEmbed("Nekos Disabled", "Nekos have been disabled :(", true);
			case "enable":
				if (!msg.member.hasPermission("MANAGE_GUILD")) {
					return NoPerms();
				}
				GuildManager.Set(msg.guild.id, { nekos: true });
				return SuccessEmbed("Nekos Enabled", "Nekos have been enabled :)", true);
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
