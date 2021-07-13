import { EventEmitter } from "events";
import WebSocket from "ws";
import { newParticipant } from "./BK-Api.d";

class BeatKhanaWebsocket extends EventEmitter {
	public connection: WebSocket;
	public reconnectFails: number;

	constructor(TournamentID: string) {
		super();

		this.connection = new WebSocket("wss://beatkhana.com/api/ws");

		this.connection.addEventListener("close", () => {
			this.emit("close");
		});

		this.connection.addEventListener("error", (data) => {
			this.emit("error", data);
		});

		this.connection.addEventListener("open", (data) => {
			this.connection.send(JSON.stringify({ setTournament: TournamentID }));
			this.emit("open", data);
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
	on(event: "close", listener: () => void): this;
	on(event: "error", listener: (data: { error: any; message: any; type: string; target: WebSocket }) => void): this;
	on(event: "open", listener: (data: { target: WebSocket }) => void): this;

	on(event: "raw", listener: (data: { data: any; type: string; target: WebSocket }) => void): this;

	on(event: "signup", listener: (signupData: newParticipant) => void): this;
}

export default BeatKhanaWebsocket;
