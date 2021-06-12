import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";

class HelpCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var Modules: BaseCommandWithModuleNames[] = [];

		CommandManager.commands.forEach((cmd) => {
			if (cmd.hidden) return;
			if (cmd.RequiredPermission && !msg.member.hasPermission(cmd.RequiredPermission)) return;

			var i = Modules.findIndex((c) => c.module_name == cmd.Module);
			if (i == -1) {
				Modules.push({
					module_name: cmd.Module,
					commands: [cmd],
				});
			} else {
				Modules[i].commands.push(cmd);
			}
		});

		var page = 0;

		var menu = await msg.channel.send(GenerateHelpEmbed(page, Modules));
		menu.react("⬅️");
		menu.react("➡️");
		var collector = menu.createReactionCollector(
			(reaction: MessageReaction, user: User) => {
				return reaction.emoji.name === "⬅️" || (reaction.emoji.name === "➡️" && !user.bot && user.id == msg.author.id);
			},
			{ time: 60000 }
		);

		collector.on("collect", (r: MessageReaction, u: User) => {
			if (u.bot) return;

			if (r.emoji.name == "⬅️" && page != 0) {
				page--;
				menu.edit(GenerateHelpEmbed(page, Modules));
				r.users.remove(u.id);
			} else if (r.emoji.name == "➡️" && page + 1 != Modules.length) {
				page++;
				menu.edit(GenerateHelpEmbed(page, Modules));
				r.users.remove(u.id);
			}
		});
		collector.on("end", () => {
			msg.delete();
			menu.delete();
		});
	}

	label = "help";
	description = "The Help Menu Command!";
	Module = "Info";
}

function GenerateHelpEmbed(page: number, Modules: BaseCommandWithModuleNames[]) {
	var Module = Modules[page];

	var embed = new MessageEmbed({
		title: "BotKhana Commands",
		description: `**${Module.module_name}**`,
		footer: {
			text: `Page: ${page + 1}/${Modules.length}`,
		},
		color: "33A7FF",
	});

	Module.commands.forEach((cmd) => {
		embed.addField(`?${cmd.label} ${cmd.Args.join(" ")}`, cmd.description);
	});

	return embed;
}

type BaseCommandWithModuleNames = {
	module_name: string;
	commands: BaseCommand[];
};

CommandManager.registerCommand(new HelpCommand());
