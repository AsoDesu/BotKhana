import { Message, PermissionResolvable } from "discord.js";
import BKApi from "../../api/BeatKhana/BK-Api";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import TournamentNotFound from "../../Utils/Embeds/Presets/TournamentNotFound";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class Update extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		// Get the tournament from the guild. (No multi tourney here), Send an error if there isn't one
		let Tournament = (await TournamentManager.GetDataFromGuildId(msg.guild.id))[0];
		if (!Tournament) return ErrorEmbed("No Tournament", "There is not a tournament linked to this guild");

		// Get the Bracket from that Tournament
		let Bracket = await BKApi.Bracket(Tournament.tournamentId);
		if (!Bracket) return ErrorEmbed("Bracket Not Found", "Couldn't get the bracket for the tournament linked to this server.");

		// Get the target user from the first argument, if it's a Discord User, remove the fancy discord ping stuff
		let TargetUser = args[0].replace(/(<|@|>|!)/g, "");
		// Get the matches of the specified user, remove any that are already completed, or that don't have a second player
		// If there are more than 1, Send an error
		let Matches = Bracket.filter((m) => m.status != "complete" && m.p1.id && m.p2.id && (LowerCase(m.p1.id) == TargetUser || LowerCase(m.p2.id) == TargetUser));
		if (Matches.length > 1) {
			//return ErrorEmbed("Multiple Matches", "There are multiple matches going on with that user");
		} else if (Matches.length == 0) {
			return ErrorEmbed("No Matches Found", "We couldn't find any matches with that user");
		}

		// Store the match
		let Match = Matches[0];

		// Check which player the TargetUser is
		if (LowerCase(Match.p1.id) == TargetUser) {
			// Update Player 1 with the specified score
			BKApi.SetBracketMatch(Tournament.tournamentId, Match.id, {
				p1Score: parseInt(args[1]),
				p2Score: Match.p2.score,
			});
			return SuccessEmbed(
				"Updated Bracket",
				`${Match.p1.name ? Match.p1.name : Match.p1.id}: ${args[1]}\n${Match.p2.name ? Match.p2.name : Match.p2.id}: ${Match.p2.score}`
			);
		} else {
			// Update Player 1 with the specified score
			BKApi.SetBracketMatch(Tournament.tournamentId, Match.id, {
				p2Score: parseInt(args[1]),
				p1Score: Match.p1.score,
			});
			return SuccessEmbed(
				"Updated Bracket",
				`${Match.p1.name ? Match.p1.name : Match.p1.id}: ${Match.p1.score}\n${Match.p2.name ? Match.p2.name : Match.p2.id}: ${args[1]}`
			);
		}
	}

	label = "update";
	aliases = ["updatebracket"];
	Args = ["(User)", "(Score)"];
	RequiredPermission = "MUTE_MEMBERS" as PermissionResolvable;
	description = "Updates the linked BeatKhana bracket";
}

function LowerCase(x: string) {
	if (!x) return "";
	return x.toLowerCase();
}

CommandManager.registerCommand(new Update());
