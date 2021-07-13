import { Message, PermissionResolvable } from "discord.js";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";
import GuildManager from "../../DatabaseManager/GuildManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class ReconnectCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		let Guild = await GuildManager.Get(msg.guild.id);

		if (!Guild.ta_ip) {
			return ErrorEmbed("TA isn't linked", "TA isn't linked run ?connect (TA IP:PORT) [(PASSWORD)] to connect.");
		}

		let TAManager = TALinkManager.GetTA(msg.guild.id);
		if (TAManager) {
			return ErrorEmbed("TA is already connected", "Run ?disconnect to disconnect.");
		}

		let Connection = TALinkManager.LinkTA(msg.guild, Guild.ta_ip, Guild.ta_password);

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

	label = "reconnect";
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;

	description = "Reconnects to TA if the bot disconnects from your TA server";

	Module = "Tournament Assistant";
}

CommandManager.registerCommand(new ReconnectCommand());
