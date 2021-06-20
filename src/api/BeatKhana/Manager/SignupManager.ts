import { Guild, GuildMember, MessageEmbed, TextChannel, User } from "discord.js";
import TournamentManager, { TournamentData } from "../../../DatabaseManager/TournamentManager";
import Client from "../../../index";
import BKApi from "../BK-Api";
import { newParticipant } from "../BK-Api.d";
import BK_WebSocket from "../BK-Websocket";
import GetDefaultTrue from "../../../Utils/GetDefaultTrue";
import Log from "../../../Utils/BotLogs/Log";

interface TournamentWebsocket {
	guildId: string;
	tournamentId: string;
	WebSocket: BK_WebSocket;
}

var TournamentWebscokets: TournamentWebsocket[] = [];

function RegisterWebSocket(TournamentId: string, GuildId: string) {
	var data = {
		tournamentId: TournamentId,
		guildId: GuildId,
		WebSocket: new BK_WebSocket(TournamentId),
	};
	TournamentWebscokets.push(data);

	data.WebSocket.on("error", () => {
		return -1;
	});

	data.WebSocket.on("signup", async (signup) => {
		NewSignup(signup);
	});

	data.WebSocket.on("close", () => {
		Log("Disconnected from WebSocket for tournament with id: " + TournamentId, __filename);
	});
}

function RemoveWebSocket(TournamentId: string) {
	var TournamentIndex = TournamentWebscokets.findIndex((t) => t.tournamentId == TournamentId);
	if (!TournamentIndex) return -1;
	TournamentWebscokets.splice(TournamentIndex);
	return 0;
}

async function NewSignup(signup: newParticipant) {
	var client = Client();
	var TournamentData = await TournamentManager.GetData(signup.newParticipant.tournamentId.toString());

	if (!GetDefaultTrue(TournamentData.syncSignups)) return;

	var Guild = client.guilds.cache.get(TournamentData.guildId);
	if (!Guild) return;

	var Member = await Guild.members.fetch(signup.newParticipant.userId).catch(() => {
		return;
	});
	if (!Member) return;

	AddRole(Member, TournamentData.signupRole);

	SendSignupEmbed(TournamentData, Member.user, Guild, signup);
}

async function AddRole(Member: GuildMember, RoleId: string) {
	var Role = Member.guild.roles.cache.find((r) => r.id == RoleId);
	if (!Role) return -1;

	if (Member.roles.cache.has(Role.id)) return 0;
	Member.roles.add(Role);
	return 1;
}

async function SendSignupEmbed(TournamentData: TournamentData, Member: User, Guild: Guild, signup: newParticipant) {
	if (!TournamentData.signupsChannel) return;

	var SignupChannel = Guild.channels.cache.get(TournamentData.signupsChannel);
	if (!SignupChannel) return;

	var User = await BKApi.User(signup.newParticipant.userId);
	if (!User) return;

	(SignupChannel as TextChannel).send(
		new MessageEmbed({
			title: `${Member.username} Signed up`,
			description: `[ScoreSaber](https://scoresaber.com/u/${User.ssId}) | [Twitch](https://twitch.tv/${User.twitchName})\n**Global Rank**: #${
				User.globalRank
			}\n**Regional Rank**: #${User.localRank} :flag_${User.country.toLowerCase()}:${
				TournamentData.showComment == null || TournamentData.showComment == true ? `\n**Comment**: ${signup.newParticipant.comment}` : ""
			}`,
			thumbnail: {
				url: Member.avatarURL({ dynamic: true }),
			},
			color: "e642f5",
		})
	);
}

async function InitalizeAll(Tournaments: TournamentData[]) {
	Tournaments.forEach((tournament) => {
		RegisterWebSocket(tournament.tournamentId, tournament.guildId);
	});
	console.log(`Initalized ${Tournaments.length} Tournaments`);
}

async function SyncUser(UserId: string, Guild: Guild, TournamentData: TournamentData) {
	var TournamentId = TournamentData.tournamentId;

	var Participants = await BKApi.Participants(TournamentId);
	if (!Participants) return;

	var User = Participants.find((u) => u.discordId == UserId);
	if (!User) return;

	var Member = await Guild.members.fetch(UserId).catch(() => {
		return;
	});
	if (!Member) return;

	var RoleResult = await AddRole(Member, TournamentData.signupRole);
	if (RoleResult == 0) return;

	SendSignupEmbed(TournamentData, Member.user, Guild, { newParticipant: { comment: "", tournamentId: parseInt(TournamentId), userId: UserId } });
}

async function SyncAll(Guild: Guild, TournamentData: TournamentData) {
	var SyncedUsers = 0;
	var Participants = await BKApi.Participants(TournamentData.tournamentId);
	if (!Participants) return;

	Participants.forEach(async (p) => {
		var Member = Guild.members.cache.get(p.discordId);
		if (!Member) return;

		SyncedUsers++;
		if ((await AddRole(Member, TournamentData.signupRole)) != 1) {
			SyncedUsers--;
			return;
		}

		SendSignupEmbed(TournamentData, Member.user, Guild, { newParticipant: { comment: "", tournamentId: parseInt(TournamentData.tournamentId), userId: p.discordId } });
	});

	return SyncedUsers;
}

export default {
	NewSignup,
	RegisterWebSocket,
	InitalizeAll,
	RemoveWebSocket,
	SyncUser,
	SyncAll,
};
