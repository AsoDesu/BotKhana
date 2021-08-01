import { MessageEmbed } from "discord.js";
import GetDefaultTrue from "../GetDefaultTrue";
import HexToDecimal from "../HexToDecimal";

export default (title: string, text: string, emote?: boolean) =>
	new MessageEmbed({
		title: title,
		description: `${GetDefaultTrue(emote) ? "<:BK_Success:853322923687018546>" : ""} ${text}`,
		color: HexToDecimal("33A7FF"),
	});
