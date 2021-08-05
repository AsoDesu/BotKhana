import fetch from "got";
import { BeatSaverMap } from "./Types";
var got = fetch.extend({});

class BeatSaverClient {
	public async getMapFromId(id: string) {
		try {
			let res = await got(`https://api.beatsaver.com/maps/id/${id}`);
			return JSON.parse(res.body) as BeatSaverMap;
		} catch {
			return null;
		}
	}

	public async getMapFromKey(key: string) {
		try {
			let res = await got(`https://api.beatsaver.com/maps/beatsaver/${key}`);
			return JSON.parse(res.body) as BeatSaverMap;
		} catch {
			return null;
		}
	}

	public async getMapFromHash(hash: string) {
		try {
			let res = await got(`https://api.beatsaver.com/maps/hash/${hash}`);
			return JSON.parse(res.body) as BeatSaverMap;
		} catch {
			return null;
		}
	}
}

export default new BeatSaverClient();
