import { MessageEmbed } from "discord.js";
import HexToDecimal from "../HexToDecimal";

export default (title: string, text: string) =>
	new MessageEmbed({
		title: title,
		description: "<:BK_Success:853322923687018546> " + text,
		color: HexToDecimal("33A7FF"),
	});
