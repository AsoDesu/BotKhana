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
		Log(`WebSocket on tournament ${TournamentId} had an error`, __filename);
		return -1;
	});

	data.WebSocket.on("signup", async (signup) => {
		Log(`${signup.newParticipant.userId} Signed up to ${signup.newParticipant.tournamentId}`, __filename);
		NewSignup(signup);
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
		Log(`Failed to get user ${signup.newParticipant.userId}, from discord, tournament: ${signup.newParticipant.tournamentId}`, __filename);
		return;
	});
	if (!Member) return;

	AddRole(Member, TournamentData.signupRole);

	SendSignupEmbed(TournamentData, Member.user, Guild, signup);
}

async function AddRole(Member: GuildMember, RoleId: string) {
	var Role = Member.guild.roles.cache.find((r) => r.id == RoleId);
	if (!Role) {
		let FetchedRole = await Member.guild.roles.fetch(RoleId).catch(() => {
			console.log("Failed");
			return;
		});
		if (!FetchedRole) return;

		Role = FetchedRole;
	}

	if (Member.roles.cache.has(Role.id)) return 0;
	Member.roles.add(Role);
	return 1;
}

async function SendSignupEmbed(TournamentData: TournamentData, Member: User, Guild: Guild, signup: newParticipant) {
	if (!TournamentData.signupsChannel) return;

	var SignupChannel = Guild.channels.cache.get(TournamentData.signupsChannel);
	if (!SignupChannel) {
		Log(`Failed to get signup channel for tournament ${signup.newParticipant.tournamentId}`, __filename);
		return;
	}

	var User = await BKApi.User(signup.newParticipant.userId);
	if (!User) {
		Log(`Failed to get user ${signup.newParticipant.userId}, for tournament ${signup.newParticipant.tournamentId}`, __filename);
		return;
	}

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
			color: "e970f5",
			url: `https://beatkhana.com/tournament/${TournamentData.tournamentId}/participants`,
		})
	);
}

async function InitalizeAll() {
	var Tournaments = await TournamentManager.GetAllTournaments();
	Tournaments.forEach((tournament) => {
		if (!Client().guilds.cache.get(tournament.guildId)) return;
		RegisterWebSocket(tournament.tournamentId, tournament.guildId);
	});
	console.log(`Initalized ${Tournaments.length} Tournaments`);
}

async function SyncUser(UserId: string, Guild: Guild, TournamentData: TournamentData) {
	var TournamentId = TournamentData.tournamentId;

	var Participants = await BKApi.Participants(TournamentId);
	if (!Participants) return;

	var User = Participants.find((u) => u.discordId == UserId);
	if (!User) {
		return;
	}

	var Member = await Guild.members.fetch(UserId).catch(() => {
		Log(`Failed to get user ${UserId}`, __filename);
		return;
	});
	if (!Member) return;

	var RoleResult = await AddRole(Member, TournamentData.signupRole);
	if (RoleResult == 0) return;

	SendSignupEmbed(TournamentData, Member.user, Guild, { newParticipant: { comment: "", tournamentId: parseInt(TournamentId), userId: UserId } });
}

async function SyncAll(Guild: Guild, TournamentData: TournamentData) {
	var Participants = await BKApi.Participants(TournamentData.tournamentId);
	if (!Participants) return;

	Participants.forEach(async (p) => {
		var Member = await Guild.members.fetch(p.discordId).catch(() => {
			Log(`Failed to get user ${p.name}`, __filename);
			return;
		});
		if (!Member) return;

		if ((await AddRole(Member, TournamentData.signupRole)) != 1) {
			return;
		}

		SendSignupEmbed(TournamentData, Member.user, Guild, { newParticipant: { comment: "", tournamentId: parseInt(TournamentData.tournamentId), userId: p.discordId } });
	});
	return;
}

export default {
	NewSignup,
	RegisterWebSocket,
	InitalizeAll,
	RemoveWebSocket,
	SyncUser,
	SyncAll,
	TournamentWebscokets,
};
