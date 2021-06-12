import { GuildMember, PartialGuildMember } from "discord.js";
import SignupManager from "../BeatKhanaApi/Manager/SignupManager";
import TournamentManager from "../DatabaseManager/TournamentManager";

async function UserJoin(e: PartialGuildMember | GuildMember) {
	if (!(e instanceof GuildMember)) return;
	var Tournaments = await TournamentManager.GetDataFromGuildId(e.guild.id);

	Tournaments.forEach((t) => {
		SignupManager.SyncUser(e.id, e.guild, t);
	});
}

export default UserJoin;
