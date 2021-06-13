import { Message, PermissionResolvable } from "discord.js";
import SignupManager from "../../BeatKhanaApi/Manager/SignupManager";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import TournamentNotFound from "../../Utils/Embeds/Presets/TournamentNotFound";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class SyncCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (isNaN(parseInt(args[0]))) return ErrorEmbed("Incorrect Argument", "You need to provide a TournamentID.");
		var TournamentData = await TournamentManager.GetData(args[0]);
		if (!TournamentData) return TournamentNotFound();
		if (TournamentData.guildId != msg.guild.id) return ErrorEmbed("Linked to another server.", "This tournament has been linked to another discord server.");

		var SyncedUsers = await SignupManager.SyncAll(msg.guild, TournamentData);
		return SuccessEmbed("Synced Users", `Successfully synced ${SyncedUsers} user${SyncedUsers == 1 ? "" : "s"}`);
	}

	label = "sync";
	description = "Manually sync the members who have signed up.";
	RequiredPermission = "MANAGE_GUILD" as PermissionResolvable;
	Args = ["(Tournament ID)"];

	Module = "BeatKhana";
}

CommandManager.registerCommand(new SyncCommand());
