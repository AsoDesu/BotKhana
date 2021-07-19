import { MessageActionRow, MessageButton, MessageComponent, MessageComponentTypes, MessageMenu, MessageMenuOption } from "discord-buttons";
import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../BaseCommand";
import CommandManager from "../CommandManager";
import client from "../../index";
import bk from "../../api/BeatKhana/BK-Api";
import TALinkManager from "../../api/TournamentAssistantManager/TALinkManager";

class test extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		return "nothing for you here....";
	}

	label = "test";
	hidden = true;
}

CommandManager.registerCommand(new test());
