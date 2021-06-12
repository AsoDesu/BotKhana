import fetch from "got";
var got = fetch.extend({
	headers: {
		cookie: "uId=s%3AULKy4PQYkDtaRClPBPuneOQDBGZEHykF.iY4N5cOzZ0rDc2L7p9aROhQa7S2ugXLQd1P1s%2BRO1WE",
	},
});

import * as types from "./BK-Api.d";
import BK_WebSocket from "./BK-Websocket";

class BeatKhanaApi {
	public async Tournament(id: string) {
		var res = await got(`https://beatkhana.com/api/tournament/${id}/`).catch(() => {
			return { body: null };
		});
		if (res.body == null) return null;
		return JSON.parse(res.body)[0] as types.tournament;
	}

	public async Staff(id: string) {
		var res = await got(`https://beatkhana.com/api/tournament/${id}/staff`).catch(() => {
			return { body: null };
		});
		if (res.body == null) return null;
		return JSON.parse(res.body) as types.staff_user[];
	}

	public async Bracket(id: string) {
		var res = await got(`https://beatkhana.com/api/tournament/${id}/bracket`).catch(() => {
			return { body: null };
		});
		if (res.body == null) return null;
		return JSON.parse(res.body) as types.bracketMatch[];
	}

	public async User(id: string) {
		var res = await got(`https://beatkhana.com/api/user/${id}`).catch(() => {
			return { body: null };
		});
		if (res.body == null) return null;
		return JSON.parse(res.body) as types.user;
	}

	public async MapPool(id: string) {
		var res = await got(`https://beatkhana.com/api/tournament/${id}/map-pools`).catch(() => {
			return { body: null };
		});
		if (res.body == null) return null;
		var data = JSON.parse(res.body) as types.pools;
		return Object.values(data) as types.pool[];
	}
	public async Participants(id: string) {
		var res = await got(`https://beatkhana.com/api/tournament/${id}/participants`).catch(() => {
			return { body: null };
		});
		if (res.body == null) return null;
		return JSON.parse(res.body) as types.participant[];
	}
}

export default new BeatKhanaApi();
