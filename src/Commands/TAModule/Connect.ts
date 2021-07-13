import { Message, PermissionResolvable } from "discord.js";
import { URL } from "url";
import Client from "../../api/TournamentAssistant/Client";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";
import GuildManager from "../../DatabaseManager/GuildManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import WarningEmbed from "../../Utils/Embeds/WarningEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class ConnectCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!args[0].includes(":")) return WarningEmbed("Incorrect Argument", "You need to provide a TA Overlay IP:Port, in the format `ip:port`, e.g. `ta.asodev.net:10157`");

		let url;
		try {
			url = new URL("ws://" + args[0]);
		} catch (_) {
			return ErrorEmbed("Invalid URL", "That URL is invalid.");
		}

		if (TALinkManager.GetTA(msg.guild.id)) return ErrorEmbed("Already Connected To TA", "This server has already been connected to TA, do `?disconnect` to disconnect");

		let Connection = TALinkManager.LinkTA(msg.guild, args[0], args[1]);

		msg.channel.send("Connecting...");

		Connection.Client.ws.once("error", () => {
			//StatusMessage.edit();
			msg.channel.send(ErrorEmbed("Failed to Connect to TA", `Failed to connect to TA Overlay with address \`${args[0]}\`, did you put the correct overlay port?`));
			TALinkManager.UnlinkTA(msg.guild.id);
		});

		Connection.Client.once("ta_error", (err) => {
			//StatusMessage.edit();
			msg.channel.send(ErrorEmbed("Incorrect Password", "Failed to connect to TA server, Incorrect Password."));
			TALinkManager.UnlinkTA(msg.guild.id);
		});

		Connection.Client.once("connect", () => {
			//StatusMessage.edit();
			msg.channel.send(SuccessEmbed("Successfully Connected to TA", `Successfully connected to TA server ${Connection.Client.ServerName}`));
			GuildManager.Set(msg.guild.id, { ta_ip: args[0], ta_password: args[1] ? args[1] : "" });
		});
	}

	label = "connect";
	Args = ["(TournamentAssistant IP:PORT) [(Password)]"];
	Module = "Tournament Assistant";

	description = "Links your discord server to a TA server";

	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;
}

CommandManager.registerCommand(new ConnectCommand());
