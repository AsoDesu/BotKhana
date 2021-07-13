import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import BKApi from "../../api/BeatKhana/BK-Api";
import { tournament, bracketMatch } from "../../api/BeatKhana/BK-Api.d";
import TournamentManager from "../../DatabaseManager/TournamentManager";
import SuccessEmbed from "../../Utils/Embeds/SuccessEmbed";
import HexToDecimal from "../../Utils/HexToDecimal";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import numberEmotes from "../../Utils/Emotes/NumberEmotes";
import WarningEmbed from "../../Utils/Embeds/WarningEmbed";

type reaction = { emote: string; id: string };

class NextMatch extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var data = await TournamentManager.GetDataFromGuildId(msg.guild.id);

		if (data.length == 0) {
			return WarningEmbed("There are no tournaments here!", "There aren't any tournament linked to this server.");
		}

		if (data.length != 1) {
			var reactions: reaction[] = [];
			var desc = "";
			data.forEach((d) => {
				reactions.push({ emote: numberEmotes[data.indexOf(d)], id: d.tournamentId });
				desc = desc + `\n ${numberEmotes[data.indexOf(d)]} - **${d.tournamentName}**`;
			});
			var TournamentSelection = await msg.channel.send(
				new MessageEmbed({
					title: "Which tournament are you playing in?",
					description: `This discord server has multiple tournaments linked to it, please select the one you want.\n ${desc}`,
				})
			);
			reactions.forEach((r) => {
				TournamentSelection.react(r.emote);
			});

			var collector = TournamentSelection.createReactionCollector((reaction: MessageReaction, user: User) => {
				return reactions.find((r) => r.emote == reaction.emoji.name) != null && user.id == msg.author.id;
			});
			collector.on("collect", async (reaction: MessageReaction) => {
				TournamentSelection.reactions.removeAll();
				TournamentSelection.edit(await NextMatchEmbed(msg.author.id, reactions.find((r) => r.emote == reaction.emoji.name).id));
				collector.stop();
			});
		} else {
			return NextMatchEmbed(msg.author.id, data[0].tournamentId);
		}
	}

	label = "nextmatch";
	description = "Get your next match";
	aliases = ["next"];

	Module = "Players";
}

async function NextMatchEmbed(userId: string, TournamentId: string) {
	var bracket = await BKApi.Bracket(TournamentId);

	// Get players matches and sort by time.
	var matches = bracket.filter((m) => (m.p1.id == userId || m.p2.id == userId) && m.status != "complete");
	matches.sort((a: bracketMatch, b: bracketMatch) => {
		return Date.parse(a.time) - Date.parse(b.time);
	});

	if (matches.length == 0) {
		return SuccessEmbed("Matches not found.", "You have no more scheduled matches.");
	}

	var nextMatch = matches[0];
	var p1 = await BKApi.User(nextMatch.p1.id);
	var p2 = await BKApi.User(nextMatch.p2.id);
	return new MessageEmbed({
		title: `Match ${nextMatch.matchNum + 1}`,
		description: `**[${p1.name}](https://scoresaber.com/u/${p1.ssId})** vs **[${p2.name}](https://scoresaber.com/u/${p2.ssId})**`,
		fields: [{ name: "Time", value: generateDate(nextMatch.time), inline: true }],
		color: "cc34eb",
	});
}

function generateDate(time: string) {
	var date = new Date();
	date.setTime(Date.parse(time));
	// 01/01/2021 07:26 AM
	return `${x(date.getUTCDate())}/${x(date.getUTCMonth())}/${date.getUTCFullYear()} ${formatAMPM(date)}`;
}

function x(x: number) {
	return x.toLocaleString("en-us", { minimumIntegerDigits: 2 });
}

// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function formatAMPM(date: Date) {
	var hours = date.getHours();
	var minutes: any = date.getMinutes();
	var ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = (minutes < 10 ? "0" + minutes : minutes).toString();
	var strTime = hours + ":" + minutes + " " + ampm;
	return strTime;
}

CommandManager.registerCommand(new NextMatch());
