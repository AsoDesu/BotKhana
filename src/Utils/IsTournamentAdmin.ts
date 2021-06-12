import bk from "../BeatKhanaApi/BK-Api";

export default async function isTournamentAdmin(userId: string, TournamentId: string): Promise<boolean> {
	var staff = await bk.Staff(TournamentId);
	if (staff == null) return false;

	var staff_user = staff.find((u) => u.discordId == userId);
	if (!staff_user) return false;
	if (!staff_user.roles.find((r) => r.id == 1)) return false;

	return true;
}
