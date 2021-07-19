import { EventEmitter } from "events";
import WebSocket from "ws";
import {
	CoordinatorConnect,
	CoordinatorResponse,
	DisconnectCoordinator,
	MatchCreate,
	MatchUpdate,
	Packet,
	PlayerCompleted,
	PlayerConnect,
	PlayerDisconnect,
	UpdatePacket,
} from "./Types/EventTypes";
import ConnectCoordinator from "./Packets/ConnectCoordinator";
import DisconnectCoordinatorPacket from "./Packets/DisconnectCoordinator";
import { Coordinator, Match, Player, PlayerData, ServerState } from "./Types/Types";
import VersionInfo from "./VersionInfo";

class Client extends EventEmitter {
	public ws: WebSocket;

	public ip: string;
	public password: string;

	public self: Coordinator;

	public ServerName: string = "Default Server Name";
	public Coordinators: Coordinator[] = [];
	public Players: Player[] = [];
	public Matches: Match[] = [];

	public CompletedPlayers: PlayerData[] = [];

	private DisconnectCalls = 0;

	constructor(ip: string, password?: string, name?: string) {
		super();

		this.ws = new WebSocket("ws://" + ip);

		this.ws.on("close", () => {
			this.emit("close");
		});

		this.ws.on("open", () => {
			this.emit("open");

			this.Send(
				new ConnectCoordinator({
					SpecificPacket: {
						ClientType: 1,
						ClientVersion: VersionInfo.ClientVersion,
						Name: name ? name : "BotKhana",
						Password: password ? password : "",
						UserId: "0",
					},
				})
			);
		});

		this.ws.on("message", async (msg) => {
			let message = (await JSON.parse(msg.valueOf().toString())) as Packet;
			this.emit("message", message);

			if (message.Type == 1) return;
			if (this.Players.find((p) => p.Id == message.From)) {
				this.PlayerPacket(message);
				return;
			}
			if (message.From != "00000000-0000-0000-0000-000000000000") return;

			switch (message.Type) {
				case 3:
					let data = message as CoordinatorResponse;
					if (data.SpecificPacket.Type != 0) {
						this.emit("ta_error", { err: this.INCORRECT_PASSWORD });
						this.ws.close();
						return;
					}

					this.Coordinators = data.SpecificPacket.State.Coordinators;
					this.Matches = data.SpecificPacket.State.Matches;
					this.Players = data.SpecificPacket.State.Players;
					this.ServerName = data.SpecificPacket.State.ServerSettings.ServerName;

					this.emit("connect", data.SpecificPacket);
					this.Disconnect(true);
					return;
				case 4:
					this.UpdatePacket(message as UpdatePacket);
					return;
			}
		});
	}

	public Send(data: Packet) {
		if (this.ws.readyState != this.ws.OPEN) return 0;
		this.ws.send(JSON.stringify(data));
		return 1;
	}

	public Disconnect(keepws?: boolean) {
		this.Coordinators.forEach((c) => {
			if (c.Name.includes("BotKhana")) {
				this.Send(
					new DisconnectCoordinatorPacket({
						SpecificPacket: {
							ChangedObject: c,
						},
					} as DisconnectCoordinator)
				);
			}
		});
		if (keepws) return;
		this.ws.close();
	}

	public DisconnectExtras() {
		if (this.DisconnectCalls >= 10) return;
		let BotKhanas = this.Coordinators.filter((c) => c.Name.includes("BotKhana"));
		BotKhanas.forEach((c) => {
			this.Send(
				new DisconnectCoordinatorPacket({
					SpecificPacket: {
						ChangedObject: c,
					},
				} as DisconnectCoordinator)
			);
		});

		let AfterBotKhanas = this.Coordinators.filter((c) => c.Name.includes("BotKhana"));
		if (AfterBotKhanas.length != 0) {
			this.DisconnectCalls++;
			this.DisconnectExtras();
		}
	}

	private UpdatePacket(Packet: UpdatePacket) {
		switch (Packet.SpecificPacket.Type) {
			case 1:
				if (this.PlayerExists((Packet as PlayerConnect).SpecificPacket.ChangedObject)) {
					this.UpdatePlayer((Packet as PlayerConnect).SpecificPacket.ChangedObject);
					return;
				}
				this.Players.push((Packet as PlayerConnect).SpecificPacket.ChangedObject);
				this.emit("player_connect", (Packet as PlayerConnect).SpecificPacket.ChangedObject);
				break;
			case 2:
				this.DisconnectPlayer((Packet as PlayerDisconnect).SpecificPacket.ChangedObject);
				break;
			case 3:
				this.Coordinators.push((Packet as CoordinatorConnect).SpecificPacket.ChangedObject);
				this.emit("coordinator_connect", (Packet as CoordinatorConnect).SpecificPacket.ChangedObject);
				break;
			case 4:
				this.DisconnectCoordinator((Packet as CoordinatorConnect).SpecificPacket.ChangedObject);
				break;
			case 5:
				if (this.MatchExists((Packet as MatchCreate).SpecificPacket.ChangedObject)) return;
				this.Matches.push((Packet as MatchCreate).SpecificPacket.ChangedObject);
				this.emit("match_create", (Packet as MatchCreate).SpecificPacket.ChangedObject);
				break;
			case 6:
				this.UpdateMatch((Packet as MatchUpdate).SpecificPacket.ChangedObject);
				break;
			case 7:
				this.RemoveMatch((Packet as MatchCreate).SpecificPacket.ChangedObject);
				break;
		}
	}

	private UpdateMatch(data: Match) {
		let i = this.Matches.findIndex((m) => m.Guid == data.Guid);
		if (i == -1) return 0;

		this.Matches[i] = data;
		this.emit("match_update", data);
		return 1;
	}

	private UpdatePlayer(data: Player) {
		let i = this.Players.findIndex((p) => p.Id == data.Id);
		if (i == -1) return 0;

		this.Players[i] = data;
		this.emit("player_update", data);
		return 1;
	}

	private RemoveMatch(match: Match) {
		let i = this.Matches.findIndex((m) => match.Guid == m.Guid);
		if (i == -1) return 0;

		this.Matches.splice(i, 1);
		this.emit("match_close", match);
		return 1;
	}

	private DisconnectPlayer(player: Player) {
		let i = this.Players.findIndex((p) => player.Id == p.Id);
		if (i == -1) return 0;

		this.Players.splice(i, 1);
		this.emit("player_disconnect", player);
		return 1;
	}

	private DisconnectCoordinator(coordinator: Coordinator) {
		let i = this.Coordinators.findIndex((c) => coordinator.Id == c.Id);
		if (i == -1) return 0;

		this.Coordinators.splice(i, 1);
		this.emit("coordinator_disconnect", coordinator);
		return 1;
	}

	private MatchExists(match: Match) {
		let i = this.Matches.find((m) => m.Guid == match.Guid);
		if (!i) return false;
		return true;
	}

	private PlayerExists(player: Player) {
		let i = this.Players.find((p) => p.Id == player.Id);
		if (!i) return false;
		return true;
	}

	private PlayerPacket(Packet: Packet) {
		switch (Packet.Type) {
			case 13:
				this.PlayerCompleted((Packet as PlayerCompleted).SpecificPacket);
				break;
		}
	}

	private PlayerCompleted(player: PlayerData) {
		if (this.CompletedPlayers.find((p) => p.User.Id == player.User.Id)) return;

		this.CompletedPlayers.push(player);
		this.emit("player_complete", player);

		let match = this.GetPlayerMatch(player.User);
		if (match == null) return;

		let MatchCompletedPlayers = 0;
		match.Players.forEach((player) => {
			let CompletedPlayer = this.CompletedPlayers.find((p) => p.User.Id == player.Id);
			if (!CompletedPlayer) return;

			MatchCompletedPlayers++;
			player.Score = CompletedPlayer.Score;
		});

		if (MatchCompletedPlayers == match.Players.length) {
			this.emit("match_complete", match);
			match.Players.forEach((p) => {
				this.PlayerUncomplete(p);
			});
			MatchCompletedPlayers = 0;
		}
	}

	private PlayerUncomplete(player: Player) {
		let i = this.CompletedPlayers.findIndex((p) => p.User.Id == player.Id);
		if (i == -1) return 0;

		this.CompletedPlayers.splice(i, 1);
	}

	private GetPlayerMatch(player: Player) {
		let match = this.Matches.find((m) => m.Players.findIndex((p) => p.Id == player.Id) != -1);
		if (match) return match;
		return null;
	}

	// Inject Packet
	public InjectPacket(packet: string) {
		this.ws.emit("message", packet);
	}

	// Error Types
	public INCORRECT_PASSWORD = 0;
	public INVALID_URL = 1;
}

declare interface Client {
	on(event: "close", listener: () => void): this;
	on(event: "open", listener: () => void): this;
	on(event: "message", listener: (packet: Packet) => void): this;

	on(event: "ta_error", listener: (err: { err: number }) => void): this;
	on(event: "connect", listener: (state: { Self: Coordinator; State: ServerState }) => void): this;

	on(event: "match_create", listener: (match: Match) => void): this;
	on(event: "match_update", listener: (match: Match) => void): this;
	on(event: "match_complete", listener: (match: Match) => void): this;
	on(event: "match_close", listener: (match: Match) => void): this;

	on(event: "player_connect", listener: (player: Player) => void): this;
	on(event: "player_update", listener: (player: Player) => void): this;
	on(event: "player_disconnect", listener: (player: Player) => void): this;
	on(event: "player_complete", listener: (data: PlayerData) => void): this;

	on(event: "coordinator_connect", listener: (coordinator: Coordinator) => void): this;
	on(event: "coordinator_disconnect", listener: (coordinator: Coordinator) => void): this;
}

export default Client;
