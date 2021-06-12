import { MessageEmbed } from "discord.js";
import HexToDecimal from "../HexToDecimal";

export default (title: string, text: string) =>
	new MessageEmbed({
		title: title,
		description: "<:BK_Warning:847939162995818526> " + text,
		color: HexToDecimal("ffaa33"),
	});
