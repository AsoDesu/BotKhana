import { MessageEmbed } from "discord.js";
import HexToDecimal from "../HexToDecimal";

export default (title: string, text: string) =>
	new MessageEmbed({
		title: title,
		description: "<:BK_Error:853322910553735259> " + text,
		color: HexToDecimal("ff3333"),
	});
