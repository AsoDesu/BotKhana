import { Message, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import bk from "../../api/BeatKhana/BK-Api";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import isTournamentAdmin from "../../Utils/IsTournamentAdmin";
import CommandManager from "../CommandManager";
import TournamentNotFound from "../../Utils/Embeds/Presets/TournamentNotFound";
import SignupManager from "../../api/BeatKhana/Manager/SignupManager";

class UnlinkTournament extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var TournamentId = args[0];
		if (isNaN(parseInt(TournamentId))) return ErrorEmbed("Incorrect Argument", "You need to provide a TournamentID.");

		var Tournament = await bk.Tournament(TournamentId);

		if (Tournament == null) return TournamentNotFound();
		if (msg.author.id != Tournament.owner && !(await isTournamentAdmin(msg.author.id, TournamentId)))
			return ErrorEmbed("Error", "Only Tournament Admins and the owner can do this.");

		var TournamentData = await TournamentManager.GetData(TournamentId);
		if (TournamentData == null) return ErrorEmbed("Tournament Not Linked", "This tournament has not been linked to a discord server yet.");

		if (TournamentData.guildId != msg.guild.id) return ErrorEmbed("Linked to another server.", "This tournament has been linked to another discord server.");

		await TournamentManager.Remove(TournamentId);
		SignupManager.RemoveWebSocket(TournamentId);

		try {
			await msg.guild.roles.cache.get(TournamentData.signupRole).delete();
		} catch {
			return ErrorEmbed("Unable To Delete Role", "Unable to remove the signup role, make sure that the bot has a top role");
		}

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
