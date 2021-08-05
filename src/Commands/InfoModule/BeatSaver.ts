import { Message, MessageEmbed } from "discord.js";
import HexToDecimal from "../../Utils/HexToDecimal";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import BSApi from "beatsaver-api";
import * as types from "beatsaver-api/lib/types/BeatSaverSong";
import BeatSaverClient from "../../api/BeatSaver/BeatSaverClient";
import { BeatSaverMap, DiffsEntity, VersionsEntity } from "../../api/BeatSaver/Types";

const bs = BeatSaverClient;

const diffEmotes = {
	Easy: "``Easy``",
	Normal: "``Normal``",
	Hard: "``Hard``",
	Expert: "``Expert``",
	ExpertPlus: "``Expert+``",
};

type diffIndexType = "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";

// Added by Sirspam with a little help from Aso
class BeatSaver extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		try {
			var Map = await bs.getMapFromId(args[0]);
		} catch {
			return ErrorEmbed("Map not found", "You should try e970 though");
		}

		// Store latest version so we don't have to get it every time
		let LatestVersion = Map.versions[Map.versions.length - 1];

		// Store the metadata so we don't have to reference it by Map.metadata everytime
		// Also get the difficulty info and store date
		let Meta = Map.metadata;
		let difficulties = Difficulties(LatestVersion);
		var date = new Date(Map.uploaded);
		// Store the minutes and seconds in a variable so we can format them later
		var minutes = Math.floor(Meta.duration / 60);
		let seconds = Meta.duration - minutes * 60;
		// Create the stats for the selected difficulty in the second argument
		let stats = DifficultyStats(args[1] as diffIndexType, LatestVersion);
		// Store Mod "Requirements" Array
		let Requires = ModRequirements(stats);

		// Create the embed
		var embed = new MessageEmbed({
			title: Meta.songSubName == "" ? Meta.songName : `${Meta.songName} - ${Meta.songSubName}`,
			url: `https://beatsaver.com/beatmap/${args[0]}`,
			description: `**${Meta.songAuthorName}**`,
			image: {
				url: LatestVersion.coverURL,
			},
			color: Color(Map),
			fields: [
				{
					name: "Map Stats",
					value: `⏱ Duration: ${minutes}:${seconds.toString().length != 1 ? seconds : `0${seconds}`}\n🥁 BPM: ${Meta.bpm}\n✏️ Mapper: ${Meta.levelAuthorName}\n⚔️ ${
						Map.ranked ? "**Ranked**" : Map.qualified ? "**Qualified**" : "**Unranked**"
					}`,
					inline: true,
				},
				{
					name: "BeatSaver Stats",
					value: `🔑: ${Map.id}\n💾: ${Map.stats.downloads}\n👍: ${Map.stats.upvotes - Map.stats.downvotes}\n📅: ${date.getFullYear()}/${(date.getMonth() + 1)
						.toString()
						.padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`,
					inline: true,
				},
				{ name: "Difficulties", value: difficulties.string, inline: true },
				{
					name: `Difficulty Stats ${diffEmotes[stats.difficulty]}`,
					value: `NPS: ${stats.nps}\nNJS: ${stats.njs}\nNotes: ${stats.notes}\n${
						Requires.length != 0 ? `<:BK_ModRequired:872808303506391090> ${Requires.join(", ")}` : ""
					}`,
					inline: true,
				},
				{
					name: "Links",
					value: `[Preview Map](https://skystudioapps.com/bs-viewer/?id=${LatestVersion.key})\n[Download Map](${LatestVersion.downloadURL})`,
					inline: true,
				},
			],
		});
		return embed;
	}
	label = "beatsaver";
	aliases = ["bs", "bsr"];
	description = "Returns information on a BeatSaver map";
	Module = "Info";
}

// I hate this function so much, i never want to look at it again - Aso 26/07/21
// I had to look at it again - Aso 05/08/21
// Generates difficulty string and gets top difficulty
function Difficulties(LatestVersion: VersionsEntity) {
	let Difficulties: diffIndexType[] = [];
	let emoteString = "";

	LatestVersion.diffs
		.map((d) => d.difficulty)
		.forEach((diff) => {
			if (Difficulties.includes(diff)) return;
			Difficulties.push(diff);
			emoteString = emoteString.concat(`\n${diffEmotes[diff]}`);
		});

	return {
		string: emoteString,
		topDiff: Difficulties[Difficulties.length - 1],
	};
}

// Generate difficulty stats, i.e NPS, NJS
// Also checks if `diff` is an actual difficulty, which also accounts for if the user doesn't provide a difficulty
function DifficultyStats(diff: diffIndexType, LatestVersion: VersionsEntity) {
	let char = LatestVersion.diffs.find((d) => d.difficulty.toLowerCase() == diff);
	if (!char) {
		char = LatestVersion.diffs[LatestVersion.diffs.length - 1];
	}
	return char;
}

function ModRequirements(Diff: DiffsEntity) {
	let Requires: string[] = [];

	if (Diff.me) Requires.push("Mapping Extensions");
	if (Diff.ne) Requires.push("Noodle Extensions");
	if (Diff.chroma) Requires.push("Chroma");
	if (Diff.cinema) Requires.push("Cinema");

	return Requires;
}

function Color(Map: BeatSaverMap) {
	if (Map.ranked) {
		return "59ff85";
	} else if (Map.qualified) {
		return "ffcb59";
	} else {
		return "33A7FF";
	}
}

CommandManager.registerCommand(new BeatSaver());

export default {
	bs,
};
