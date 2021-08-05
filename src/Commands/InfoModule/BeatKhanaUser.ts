import { Message, MessageEmbed } from "discord.js";
import BKApi from "../../api/BeatKhana/BK-Api";
import ErrorEmbed from "../../Utils/Embeds/ErrorEmbed";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class BeatKhanaUser extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		// Check that a user was mentioned
		if (msg.mentions.users.size != 1) {
			return ErrorEmbed("Invalid Argument", "You need to mention a user.");
		}

		// Get the target user from BeatKhana.com
		let User = await BKApi.User(msg.mentions.users.first().id);
		if (!User) {
			// The user was not found
			return ErrorEmbed("User not found", "That user could not be found on BeatKhana.com");
		}

		// Generate and Send Embed
		return new MessageEmbed({
			title: User.name,
			fields: [
				{ name: "Accounts", value: `[Twitch](https://twitch.tv/${User.twitchName})\n[ScoreSaber](https://scoresaber.com/u/${User.ssId})`, inline: true },
				{ name: "Info", value: `Pronouns: ${User.pronoun}\nCountry: :flag_${User.country.toLowerCase()}:`, inline: true },
				{ name: "Tournaments", value: `- ${User.tournaments.join("\n - ")}`, inline: true },
			],
			thumbnail: {
				url: `https://cdn.discordapp.com/avatars/${User.discordId}/${User.avatar}.png`,
			},
			color: msg.mentions.members.first().roles.highest.color,
		});
	}
	label = "user";
	aliases = ["u"];
	Args = ["(User)"];
	description = "Gets a user from BeatKhana.com";
}

CommandManager.registerCommand(new BeatKhanaUser());
