import { Message, MessageEmbed, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import NumberEmotes from "../../Utils/Emotes/NumberEmotes";

class AddTournament extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var Tournaments = await TournamentManager.GetAllTournaments();

		var desc = `You have ${Tournaments.length} tournaments linked.\n\n`;
		Tournaments.forEach((t) => {
			desc = desc.concat(`${NumberEmotes[Tournaments.indexOf(t) + 1]} - **${t.tournamentName}** (*${t.tournamentId}*)\n`);
		});

		return new MessageEmbed({
			title: "Linked Tournaments",
			description: desc,
			color: "33A7FF",
		});
	}

	label = "listtournaments";
	aliases = ["listtourneys", "listt"];
	description = "Lists all the tournaments linked to your discord server.";

	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;

	Module = "BeatKhana";
}

CommandManager.registerCommand(new AddTournament());
