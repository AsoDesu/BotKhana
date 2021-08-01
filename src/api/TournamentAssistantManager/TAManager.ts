import { MessageButton } from "discord-buttons";
import { Message } from "discord.js";
import { Guild, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import GuildManager from "../../DatabaseManager/GuildManager";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import GetDefaultFalse from "../../Utils/GetDefaultFalse";
import BKApi from "../BeatKhana/BK-Api";
import Client from "../TournamentAssistant/Client";
import DiscordClient from "../../index";
import { Coordinator, Match, Player, Score } from "../TournamentAssistant/Types/Types";
import BeatSaver from "../../Commands/InfoModule/BeatSaver";
import { numberWithCommas } from "../../Utils/NumberWithCommas";
import { BeatSaverSong } from "beatsaver-api/lib/types/BeatSaverSong";

class TAManager {
	public Client: Client;
	public Guild: Guild;

	public LinkedCoordinators: LinkedCoordinator[] = [];
	public MapCache: BeatSaverSong[] = [];

	constructor(ip: string, password: string, Guild: Guild) {
		this.Client = new Client(ip, password);

		this.Guild = Guild;

		this.Client.on("coordinator_disconnect", (coordinator) => {
			this.UnlinkCoordinator(coordinator.Id);
		});

		this.Client.on("match_create", (match) => {
			this.MatchCreated(match);
		});

		this.Client.on("match_complete", (match) => {
			this.SongCompleted(match);
		});

		this.Client.on("qualifers_submit", (Score) => {
			this.QualierResult(Score);
		});
	}

	public LinkCoordinator(User: GuildMember, Channel: TextChannel, CoordinatorId: string) {
		let Coordinator = this.Client.Coordinators.find((c) => c.Id == CoordinatorId);

		if (!Coordinator) return this.COORDINATOR_NOT_FOUND;

		this.LinkedCoordinators.push({
			Channel,
			User,
			Coordinator,
		});

		return this.LINKED_COORDINATOR;
	}

	public MatchCreated(Match: Match) {
		let Coordinator = this.GetLinkedCoordinator(Match.Leader.Id);
		if (!Coordinator) return;

		let Channel = Coordinator.Channel;

		let Embed = new MessageEmbed({
			title: "Match Created",
			description: `${Coordinator.Coordinator.Name} Created a match with **${Match.Players.length}** Players.`,
			color: "33A7FF",
		});

		Match.Players.forEach((p) => {
			Embed.addField(p.Name, `[ScoreSaber](https://scoresaber.com/u/${p.UserId})`, true);
		});

		Channel.send(Embed).catch(() => {
			this.UnlinkCoordinator(Match.Leader.Id);
		});
	}

	public async SongCompleted(Match: Match) {
		let Coordinator = this.GetLinkedCoordinator(Match.Leader.Id);
		if (!Coordinator) return;

		let Embed = new MessageEmbed({
			title: "Song Completed",
			color: "33A7FF",
			thumbnail: {
				url: `https://scoresaber.com/imports/images/songs/${Match.SelectedLevel.LevelId.replace(`custom_level_`, "")}.png`,
			},
		});
		let SortedPlayers = Match.Players.sort((p1, p2) => {
			return p2.Score - p1.Score;
		});
		let Description = "";

		SortedPlayers.forEach((p) => {
			Description = Description.concat(`#${SortedPlayers.indexOf(p) + 1} - ${p.Name} - \`${p.Score}\`\n`);
		});
		Embed.setDescription(Description);

		let btn = await this.UpdateBracketButton(SortedPlayers, Coordinator);
		if (!btn) btn = { button: null, match: null, usrIds: null };

		Coordinator.Channel.send(Embed, btn.button)
			.catch(() => {
				this.UnlinkCoordinator(Match.Leader.Id);
			})
			.then((result) => {
				if (btn.match == null) return;
				if (!(result instanceof Message)) return;

				let collector = result.createButtonCollector(() => {
					return true;
				});

				collector.on("collect", async (interaction) => {
					if (interaction.clicker.user.id != Coordinator.User.id) {
						interaction.reply.send({ content: "You can't do this", ephemeral: true });
						return;
					}

					if (btn.match.p1.id == btn.usrIds[0]) {
						BKApi.SetBracketMatch(btn.match.tournamentId, btn.match.id, { p1Score: btn.match.p1.score + 1, p2Score: btn.match.p2.score });
						interaction.reply.send(
							SuccessEmbed("Updated Bracket", `**${btn.match.p1.name}**: ${btn.match.p1.score + 1}\n**${btn.match.p2.name}**: ${btn.match.p2.score}`, false)
						);
					} else {
						BKApi.SetBracketMatch(btn.match.tournamentId, btn.match.id, { p1Score: btn.match.p1.score, p2Score: btn.match.p2.score + 1 });
						interaction.reply.send(
							SuccessEmbed("Updated Bracket", `**${btn.match.p1.name}**: ${btn.match.p1.score}\n**${btn.match.p2.name}**: ${btn.match.p2.score + 1}`, false)
						);
					}

					collector.stop();
				});
			});
	}

	public GetLinkedCoordinator(CoordinatorId: string) {
		return this.LinkedCoordinators.find((c) => c.Coordinator.Id == CoordinatorId);
	}

	public UnlinkCoordinator(CoordinatorId: string) {
		let i = this.LinkedCoordinators.findIndex((c) => c.Coordinator.Id == CoordinatorId);
		if (i == -1) return this.COORDINATOR_NOT_FOUND;

		this.LinkedCoordinators.splice(i, 1);
		return this.UNLINKED_COORDINATOR;
	}

	private async UpdateBracketButton(Players: Player[], Coordinator: LinkedCoordinator) {
		if (Players.length != 2) return null;
		let TournamentData = await TournamentManager.GetDataFromGuildId(Coordinator.User.guild.id);
		let Tournament = TournamentData[0];
		if (!GetDefaultFalse(Tournament.updateBracketButton)) return null;

		let bracket = await BKApi.Bracket(Tournament.tournamentId);
		let AllUsers = await BKApi.AllUsers();

		let p1Id = AllUsers.find((u) => u.ssId == Players[0].UserId).discordId;
		let p2Id = AllUsers.find((u) => u.ssId == Players[1].UserId).discordId;

		var match = bracket.find((m) => (m.p1.id == p1Id || m.p2.id == p1Id) && (m.p1.id == p2Id || m.p2.id == p2Id));
		if (!match) return null;

		return {
			button: new MessageButton().setStyle("blurple").setLabel("Update Bracket").setID("up_bk"),
			match,
			usrIds: [p1Id, p2Id],
		};
	}

	private async QualierResult(Score: Score) {
		// Get Quals channel id from the Guild Data
		let GuildData = await GuildManager.Get(this.Guild.id);
		if (!GuildData.qualsChannel) return;

		// Get the channel from discord, using the id
		let QualsResultChannel = DiscordClient().channels.cache.get(GuildData.qualsChannel);
		if (!QualsResultChannel) {
			// Attempt to fetch the channel if it's not cached
			try {
				QualsResultChannel = await DiscordClient().channels.fetch(GuildData.qualsChannel);
			} catch {
				return;
			}
		}

		// Store the hash
		let hash = Score.Parameters.Beatmap.LevelId.replace("custom_level_", "");
		// Get the beatmap from BeatSaver.com
		let Beatmap = this.MapCache.find((m) => m.hash == hash);
		if (!Beatmap) {
			try {
				Beatmap = await BeatSaver.bs.getMapDetailsByHash(hash);
			} catch {
				return;
			}
		}

		// Code taken from https://github.com/AsoDesu/QualsWebsite/blob/main/js/src/index.ts
		let notes = Beatmap.metadata.characteristics.find((c) => c.name == Score.Parameters.Beatmap.Characteristic.SerializedName).difficulties[
			this.difficulty(Score.Parameters.Beatmap.Difficulty)
		].notes;
		// Calculate max score, thanks to.. someone from unnamed events for this formula!!
		let maxscore = (notes - 13) * 920 + 4715;

		// Generate embed, and send it off
		(QualsResultChannel as TextChannel).send(
			new MessageEmbed({
				title: `${Score.Username} Completed ${Score.Parameters.Beatmap.Name}`,
				description: `**Score:** ${numberWithCommas(Score._Score)}\n**Accuracy:** ${((Score._Score / maxscore) * 100).toPrecision(3)}% ${
					Score.FullCombo ? "\n`Full Combo`" : ""
				}`,
				color: "#36ff33",
				thumbnail: {
					url: `https://scoresaber.com/imports/images/songs/${hash.toUpperCase()}.png`,
				},
			})
		);
	}

	private difficulty(x: number) {
		switch (x) {
			case 0:
				return "easy";
			case 1:
				return "normal";
			case 2:
				return "hard";
			case 3:
				return "expert";
			case 4:
				return "expertPlus";
		}
	}

	// Status Types
	public COORDINATOR_NOT_FOUND = 0;
	public LINKED_COORDINATOR = 1;
	public UNLINKED_COORDINATOR = 2;
}

export interface LinkedCoordinator {
	Coordinator: Coordinator;
	Channel: TextChannel;
	User: GuildMember;
}

export default TAManager;
