import { Message, PermissionResolvable } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import bk from "../../api/BeatKhana/BK-Api";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import isTournamentAdmin from "../../Utils/IsTournamentAdmin";
import TournamentNotFound from "../../Utils/Embeds/Presets/TournamentNotFound";
import SignupManager from "../../api/BeatKhana/Manager/SignupManager";

class AddTournament extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var TournamentId = args[0];
		if (isNaN(parseInt(TournamentId))) return ErrorEmbed("Incorrect Argument", "You need to provide a TournamentID.");
		var Tournament = await bk.Tournament(args[0]);

		if (Tournament == null) return TournamentNotFound();

		if (msg.author.id != Tournament.owner && !(await isTournamentAdmin(msg.author.id, TournamentId)))
			return ErrorEmbed("Error", "Only Tournament Admins and the owner can do this.");

		var TournamentData = await TournamentManager.GetData(TournamentId);
		if (TournamentData != null)
			return ErrorEmbed("Tournament Already Linked", "This tournament has already been linked to another server. Please contact the bot staff if this is an error.");

		try {
			var role = await msg.guild.roles.create({ data: { name: `${Tournament.name} Signup` } });
		} catch {
			return ErrorEmbed("Failed to create role.", "Failed to create a signup role, make sure the bot has perms to add role.");
		}

		TournamentManager.SetData(TournamentId, {
			guildId: msg.guild.id,
			signupRole: role.id,
			tournamentId: TournamentId,
			tournamentName: Tournament.name,
		});

		SignupManager.RegisterWebSocket(TournamentId, msg.guild.id)

		return SuccessEmbed("Linked Tournament", `Successfully linked tournament '**${Tournament.name}**' to this server!\nSignup role: <@&${role.id}>`);
	}

	label = "addtournament";
	aliases = ["addtourney", "addt"];
	description = "Links a tournament on BeatKhana! to your discord server.";

	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;
	Args = ["(Tournament ID)"];

	Module = "BeatKhana";
}

CommandManager.registerCommand(new AddTournament());
