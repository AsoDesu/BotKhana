import { MessageEmbed } from "discord.js";
import HexToDecimal from "../HexToDecimal";

export default (title: string, text: string) =>
	new MessageEmbed({
		title: title,
		description: "<:BK_Warning:853322936215011359> " + text,
		color: HexToDecimal("ffaa33"),
	});
