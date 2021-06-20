import { Guild, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import Client from "../TournamentAssistant/Client";
import { Coordinator, Match } from "../TournamentAssistant/Types/Types";

class TAManager {
	public Client: Client;
	public Guild: Guild;

	public LinkedCoordinators: LinkedCoordinator[] = [];

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
			description: `${Coordinator.Coordinator.Name} Created a match with ${Match.Players.length} Players.`,
			color: "33A7FF",
		});

		Channel.send(Embed).catch(() => {
			this.UnlinkCoordinator(Match.Leader.Id);
		});
	}

	public SongCompleted(Match: Match) {
		let Coordinator = this.GetLinkedCoordinator(Match.Leader.Id);
		if (!Coordinator) return;

		let Embed = new MessageEmbed({
			title: "Song Completed",
			color: "33A7FF",
		});
		let SortedPlayers = Match.Players.sort((p1, p2) => {
			return p1.Score - p2.Score;
		});
		let Description = "";

		SortedPlayers.forEach((p) => {
			Description = Description.concat(`#${SortedPlayers.indexOf(p) + 1} - ${p.Name} - \`${p.Score}\``);
		});

		Coordinator.Channel.send(Embed).catch(() => {
			this.UnlinkCoordinator(Match.Leader.Id);
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
