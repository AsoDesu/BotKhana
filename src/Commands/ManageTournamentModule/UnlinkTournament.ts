import { Message, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import bk from "../../BeatKhanaApi/BK-Api";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import isTournamentAdmin from "../../Utils/IsTournamentAdmin";
import CommandManager from "../CommandManager";
import TournamentNotFound from "../../Utils/Embeds/Presets/TournamentNotFound";
import SignupManager from "../../BeatKhanaApi/Manager/SignupManager";

class UnlinkTournament extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var TournamentId = args[0];
		var Tournament = await bk.Tournament(TournamentId);

		if (Tournament == null) return TournamentNotFound();
		if (msg.author.id != Tournament.owner && !(await isTournamentAdmin(msg.author.id, TournamentId)))
			//return ErrorEmbed("Error", "Only Tournament Admins and the owner can do this.");

			var TournamentData = await TournamentManager.GetData(TournamentId);
		if (TournamentData == null) return ErrorEmbed("Tournament Not Linked", "This tournament has not been linked to a discord server yet.");

		if (TournamentData.guildId != msg.guild.id) return ErrorEmbed("Linked to another server.", "This tournament has been linked to another discord server.");

		await TournamentManager.Remove(TournamentId);
		await msg.guild.roles.cache.get(TournamentData.signupRole).delete();
		SignupManager.RemoveWebSocket(TournamentId);
		return SuccessEmbed("Removed Tournament.", `Successfully unlinked '**${Tournament.name}**' from this discord server.`);
	}

	label = "removetournament";
	description = "Unlink a tournament from this discord server.";
	aliases = ["removetourney", "removet"];

	Args = ["(Tournament ID)"];
	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;

	Module = "BeatKhana";
}

CommandManager.registerCommand(new UnlinkTournament());
