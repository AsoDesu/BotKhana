import { Message, MessageEmbed } from "discord.js";
import BKApi from "../../api/BeatKhana/BK-Api";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import TournamentNotFound from "../../Utils/Embeds/Presets/TournamentNotFound";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class BeatKhanaTournament extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		// Get tournaments from Guild ID
		let Tournaments = await TournamentManager.GetDataFromGuildId(msg.guild.id);
		if (Tournaments.length == 0) {
			// No tournaments, send fail embed
			return ErrorEmbed("No Tournaments", "There are no tournaments linked to this discord.");
		}
		// Store Tournament ID, And get Tournament
		let TournamentId = Tournaments[0].tournamentId;
		let Tournament = await BKApi.Tournament(TournamentId);
		if (!Tournament) {
			// Tournament Not Found
			return TournamentNotFound();
		}

		let StartDate = new Date(Tournament.startDate);
		let EndDate = new Date(Tournament.endDate);

		// Generate and send Embed
		return new MessageEmbed({
			title: Tournament.name,
			description: Markdown(Tournament.info),
			url: `https://beatkhana.com/tournament/${TournamentId}`,
			fields: [
				{
					name: "Date",
					value: `**Start Date:** ${StartDate.getDate()}/${StartDate.getMonth() + 1}/${StartDate.getFullYear()}\n**End Date:** ${EndDate.getDate()}/${
						EndDate.getMonth() + 1
					}/${EndDate.getFullYear()}`,
					inline: true,
				},
				{ name: "Links", value: `[**Twitch**](${Tournament.twitchLink})\n[**Discord**](${Tournament.discord})`, inline: true },
				{ name: "Info", value: `**Type:** ${Type(Tournament.type)}`, inline: true },
			],
			image: {
				url: `https://beatkhana.com/assets/images/${Tournament.image}`,
			},
		});
	}

	label = "tournament";
	aliases = ["t"];
	description = "Get Info from a tournament on BeatKhana.com";
}

function Markdown(x: string) {
	// https://github.com/Sirspam/Coordy-McCoordFace/blob/main/cogs/beatkhana.py
	return x
		.replace(/&nbsp;/g, " ")
		.replace(/&#39;/g, "'")
		.replace(/<p>/g, "")
		.replace(/<\/p>/g, "")
		.replace(/<strong>/g, "**")
		.replace(/<\/strong>/g, "**")
		.replace(/<em>/g, "*")
		.replace(/<\/em>/g, "*")
		.replace(/<small>/g, "*")
		.replace(/<\/small>/g, "*")
		.replace(/<ul>/g, "")
		.replace(/<\/ul>/g, "")
		.replace(/<li>/g, "- ")
		.replace(/<\/li>/g, "")
		.replace(/\n\n/g, "\n");
}

function Type(x: string) {
	switch (x) {
		case "battle_royale":
			return "`Battle Royale`";
		case "single_elim":
			return "`Single Elimination`";
		case "double_elim":
			return "`Double Elimination`";
		default:
			return `\`${x}\``;
	}
}

CommandManager.registerCommand(new BeatKhanaTournament());
