import fetch from "got";
var got = fetch.extend({
	headers: {
		Cookie: `uId=${process.env.BK_UID}`,
	},
});

import * as types from "./BK-Api.d";
import BK_WebSocket from "./BK-Websocket";

let users: types.user[];

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

	public async AllUsers() {
		if (users) {
			return users;
		}
		var res = await got(`https://beatkhana.com/api/users`).catch(() => {
			return { body: null };
		});
		if (res.body == null) return null;
		let data = (await JSON.parse(res.body)) as types.user[];
		users = data;
		return data;
	}

	// Update/Set Stuff
	public async SetBracketMatch(tournamentId: string, matchId: number, options: types.BracketUpdatePayload, complete?: boolean) {
		var res = await got.put(`https://beatkhana.com/api/tournament/${tournamentId}/bracket/${matchId}`, {
			body: JSON.stringify({ matchId, status: complete ? "complete" : "update", ...options }),
			headers: {
				"content-type": "application/json",
			},
		});
		return;
	}

	// Get Self
	public async Self() {
		try {
			var res = await got(`https://beatkhana.com/api/user`);
			if (res.body == null) return null;
			return JSON.parse(res.body)[0] as types.self;
		} catch {
			return null;
		}
	}
}

export default new BeatKhanaApi();
