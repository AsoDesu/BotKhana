import { Message, TextChannel } from "discord.js";
import Database from "../../DatabaseManager/DatabaseInit";
import BotLogs from "../../Utils/BotLogs/BotLogs";
import Log from "../../Utils/BotLogs/Log";
import LogChannelManager from "../../Utils/BotLogs/LogChannelManager";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Eval extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (msg.author.id != "580425653325791272") return;

		await Database.collection("settings").doc("logs").set({
			channel: msg.channel.id,
			guild: msg.guild.id,
		});

		BotLogs.SetManger(new LogChannelManager(msg.channel as TextChannel));
		msg.delete();
		Log("Set log channel to <#" + msg.channel.id + ">", __filename);
	}

	label = "setlogchannel";
	hidden = true;
}

CommandManager.registerCommand(new Eval());
