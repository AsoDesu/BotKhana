import { Message, MessageEmbed } from "discord.js";
import HexToDecimal from "../../Utils/HexToDecimal";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import BSApi from "beatsaver-api";
import * as types from "beatsaver-api/lib/types/BeatSaverSong";

const bs = new BSApi({
	AppName: "BotKhana",
	Version: "1.0.0",
});

const diffEmotes = {
	easy: "``Easy``",
	normal: "``Normal``",
	hard: "``Hard``",
	expert: "``Expert``",
	expertPlus: "``Expert+``",
};

type diffIndexType = "easy" | "normal" | "hard" | "expert" | "expertPlus";

// Added by Sirspam with a little help from Aso
class BeatSaver extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		try {
			var Map = await bs.getMapDetailsByKey(args[0]);
		} catch {
			return ErrorEmbed("Map not found", "You should try e970 though");
		}

		// Store the metadata so we don't have to reference it by Map.metadata everytime
		// Also get the difficulty info and store date
		let Meta = Map.metadata;
		let difficulties = Difficulties(Map);
		var date = new Date(Map.uploaded);

		// Store the minutes and seconds in a variable so we can format them later
		var minutes = Math.floor(Meta.duration / 60);
		let seconds = Meta.duration - minutes * 60;

		// Create the stats for the selected difficulty in the second argument
		let stats = DifficultyStats(args[1] as diffIndexType, Map, difficulties);

		// Create the embed
		var embed = new MessageEmbed({
			title: Meta.songSubName == "" ? Meta.songName : `${Meta.songName} - ${Meta.songSubName}`,
			url: `https://beatsaver.com/beatmap/${args[0]}`,
			description: `**${Meta.songAuthorName}**`,
			image: {
				url: `https://beatsaver.com${Map.coverURL}`,
			},
			color: "33A7FF",
			fields: [
				{
					name: "Map Stats",
					value: `⏱ Duration: ${minutes}:${seconds.toString().length != 1 ? seconds : `0${seconds}`}\n🥁 BPM: ${Meta.bpm}\n✏️ Mapper: ${Meta.levelAuthorName}`,
					inline: true,
				},
				{
					name: "BeatSaver Stats",
					value: `🔑: ${Map.key}\n💾: ${Map.stats.downloads}\n👍: ${Map.stats.upVotes - Map.stats.downVotes}\n📅: ${date.getFullYear()}/${(date.getMonth() + 1)
						.toString()
						.padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`,
					inline: true,
				},
				{ name: "Difficulties", value: difficulties.string, inline: true },
				{ name: `Difficulty Stats ${diffEmotes[stats.diffName]}`, value: `NPS: ${stats.nps}\nNJS: ${stats.njs}\nNotes: ${stats.notes}`, inline: true },
				{
					name: "Links",
					value: `[Preview Map](https://skystudioapps.com/bs-viewer/?id=${Map.key})\n[Download Map](https://beatsaver.com/api/download/key/${Map.key})`,
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
// Generates difficulty string and gets top difficulty
function Difficulties(Map: types.BeatSaverSong) {
	let diffs = Map.metadata.difficulties;
	let DifficultyString = "";
	let topDiff = "";

	function Add(emote: string) {
		DifficultyString = DifficultyString.concat(`\n${emote}`);
	}

	if (diffs.easy) {
		Add(diffEmotes.easy);
		topDiff = "easy";
	}
	if (diffs.normal) {
		Add(diffEmotes.normal);
		topDiff = "normal";
	}
	if (diffs.hard) {
		Add(diffEmotes.hard);
		topDiff = "hard";
	}
	if (diffs.expert) {
		Add(diffEmotes.expert);
		topDiff = "expert";
	}
	if (diffs.expertPlus) {
		Add(diffEmotes.expertPlus);
		topDiff = "expertPlus";
	}

	return {
		string: DifficultyString,
		topDiff: topDiff as diffIndexType,
	};
}

// Generate difficulty stats, i.e NPS, NJS
// Also checks if `diff` is an actual difficulty, which also accounts for if the user doesn't provide a difficulty
function DifficultyStats(diff: diffIndexType, Map: types.BeatSaverSong, difficulties: any) {
	let diffName = diff;
	let char = Map.metadata.characteristics[0].difficulties[diff];
	if (!char) {
		char = Map.metadata.characteristics[0].difficulties[difficulties.topDiff as diffIndexType];
		diffName = difficulties.topDiff;
	}
	return {
		notes: char.notes,
		nps: (char.notes / char.length).toFixed(2),
		njs: char.njs,
		diffName,
	};
}

CommandManager.registerCommand(new BeatSaver());

export default {
	bs,
};
