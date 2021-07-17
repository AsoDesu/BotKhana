import { EventEmitter } from "events";
import WebSocket from "ws";
import Log from "../../Utils/BotLogs/Log";
import Delay from "../../Utils/Delay";
import { newParticipant } from "./BK-Api.d";

class BeatKhanaWebsocket extends EventEmitter {
	public TournamentId: string;
	public connection: WebSocket;
	public reconnectFails: number = 0;

	constructor(TournamentID: string) {
		super();

		this.TournamentId = TournamentID;
		this.Connect();
	}

	public Connect() {
		if (this.connection) this.connection = null;
		this.connection = new WebSocket("wss://beatkhana.com/api/ws");

		this.connection.addEventListener("close", async () => {
			this.reconnectFails = 1;
			Log(`Disconnected from BeatKhana WS, Reconnecting in 5 seconds (${this.TournamentId})`, __filename);
			this.emit("reconnecting");

			await Delay(5000);
			if (this.reconnectFails >= 10) {
				Log(`Failed to reconnect 5 times`, __filename);
				return;
			}
			this.Connect();
		});

		this.connection.addEventListener("error", (data) => {
			this.emit("error", data);
		});

		this.connection.addEventListener("open", (data) => {
			this.connection.send(JSON.stringify({ setTournament: this.TournamentId }));
			this.emit("open", data);

			this.reconnectFails = 0;
			Log(`Connected to BeatKhana WS (${this.TournamentId})`, __filename);
		});

		this.connection.addEventListener("message", async (msg) => {
			this.emit("raw", await JSON.parse(msg.data));

			var data = await JSON.parse(msg.data);
			if (data.newParticipant) {
				this.emit("signup", (await JSON.parse(msg.data)) as newParticipant);
			}
		});
	}
}

declare interface BeatKhanaWebsocket {
	on(event: "reconnecting", listener: () => void): this;
	on(event: "error", listener: (data: { error: any; message: any; type: string; target: WebSocket }) => void): this;
	on(event: "open", listener: (data: { target: WebSocket }) => void): this;

	on(event: "raw", listener: (data: { data: any; type: string; target: WebSocket }) => void): this;

	on(event: "signup", listener: (signupData: newParticipant) => void): this;
}

export default BeatKhanaWebsocket;
