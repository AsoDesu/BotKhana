import { MessageEmbed, TextChannel } from "discord.js";
import path from "path";
import Client from "../../index";

class LogChannelManager {
	public ChannelId: string;
	public LogChannel: TextChannel;

	constructor(c: TextChannel) {
		this.LogChannel = c;
		this.ChannelId = c.id;

		process.on("uncaughtException", (e) => {
			this.LogChannel.send(
				new MessageEmbed({
					description: e.stack,
					color: "ff3333",
				})
			);
		});
	}

	public LogMessage(x: string, filename: string) {
		this.LogChannel.send(
			new MessageEmbed({
				author: {
					iconURL: Client().user.avatarURL(),
					name: path.basename(filename),
				},
				description: "**" + x + "**",
				color: "ffffff",
				footer: {
					text: new Date().toISOString(),
				},
			})
		);
	}
}

export default LogChannelManager;
