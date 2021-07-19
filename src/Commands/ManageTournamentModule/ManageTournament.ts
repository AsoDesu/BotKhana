import { Message, MessageEmbed, PermissionResolvable } from "discord.js";

import TournamentManager, { TournamentData } from "../../DatabaseManager/TournamentManager";

import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import WarningEmbed from "../../Utils/Embeds/WarningEmbed";
import GetDefaultFalse from "../../Utils/GetDefaultFalse";
import GetDefaultTrue from "../../Utils/GetDefaultTrue";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class ManageTournament extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (isNaN(parseInt(args[0]))) return ErrorEmbed("Incorrect Argument", "You need to provide a TournamentID.");
		var Tournament = await TournamentManager.GetData(args[0]);
		if (Tournament == null) return ErrorEmbed("Tournament Not Linked", "This tournament has not been linked to a discord server yet.");
		if (Tournament.guildId != msg.guild.id) return ErrorEmbed("Linked to another server.", "This tournament has been linked to another discord server.");

		if (!args[2]) return MenuEmbed(Tournament, args[1] ? args[1] : "", args[0]);

		var data: TournamentData = {};
		switch (args[1]) {
			case "signups-channel":
				if (msg.mentions.channels.size == 0 || msg.mentions.channels.first().type != "text")
					return ErrorEmbed("Incorrect Argument.", "You have to provide a text channel for that setting.");
				data.signupsChannel = msg.mentions.channels.first().id;
				break;
			case "signup-role":
				if (msg.mentions.roles.size < 1) return ErrorEmbed("Incorrect Argument.", "You have to provide a role for that setting.");

				data.signupRole = msg.mentions.roles.first().id;
				break;
			case "sync-signups":
				if (args[2] == "on") {
					data.syncSignups = true;
				} else if (args[2] == "off") {
					data.syncSignups = false;
				} else {
					return ErrorEmbed("Incorrect Argument.", "You have to provide a `on/off` for that setting");
				}
				break;
			case "show-comment":
				if (args[2] == "on") {
					data.showComment = true;
				} else if (args[2] == "off") {
					data.showComment = false;
				} else {
					return ErrorEmbed("Incorrect Argument.", "You have to provide a `on/off` for that setting");
				}
				break;
			case "update-bracket-button":
			case "update-bracket-btn":
			case "update-bracket":
				if (args[2] == "on") {
					data.updateBracketButton = true;
				} else if (args[2] == "off") {
					data.updateBracketButton = false;
				} else {
					return ErrorEmbed("Incorrect Argument.", "You have to provide a `on/off` for that setting");
				}
				break;
			default:
				return ErrorEmbed("Unknown Setting.", "That setting does not exist.");
		}

		await TournamentManager.SetData(args[0], data);
		return SuccessEmbed(
			"Set Setting.",
			`Successfully set setting \`${args[1]}\` to ${args[1].includes("channel") ? "" : "`"}${args[2]}${args[1].includes("channel") ? "" : "`"}`
		);
	}

	label = "settings";

	aliases = ["s"];

	Args = ["(Tournament ID) [(Setting)] [(Value)]"];
	description = "Change a tournaments settings";
	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;

	Module = "BeatKhana";
}

function MenuEmbed(TournamentData: TournamentData, value: string, tournamentId: string) {
	var Embed = new MessageEmbed({
		title: "Settings",
		description: `To change a setting run \`?settings ${tournamentId} ${value} (Value)\``,
	});

	var settings = [
		{ name: "signups-channel", value: "<#" + (TournamentData.signupsChannel ? TournamentData.signupsChannel : "Not Set") + ">" },
		{ name: "signup-role", value: TournamentData.signupRole ? `<@&${TournamentData.signupRole}>` : "Not Set" },
		{ name: "sync-signups", value: GetDefaultTrue(TournamentData.syncSignups) ? "On" : "Off" },
		{ name: "show-comment", value: GetDefaultTrue(TournamentData.showComment) ? "On" : "Off" },
		{ name: "update-bracket", value: GetDefaultFalse(TournamentData.updateBracketButton) ? "On" : "Off" },
	];

	if (value != "") settings = settings.filter((s) => s.name == value);

	settings.forEach((s) => {
		Embed.addField(s.name, `${s.value}`, true);
	});
	return Embed;
}

CommandManager.registerCommand(new ManageTournament());
