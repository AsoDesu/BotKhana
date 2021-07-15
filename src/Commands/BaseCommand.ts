import { APIMessage, Message, PermissionResolvable, StringResolvable } from "discord.js";

class BaseCommand {
	public async execute(msg: Message, args: string[]): Promise<StringResolvable | APIMessage> {
		return;
	}

	public label: string;
	public aliases: string[] = [];

	public hidden: boolean;

	public RequiredPermission: PermissionResolvable;
	public Args: string[] = [];
	public IgnoreArgs: boolean = false;

	public description: string = "No Description Provided.";
	public usage: string = `No Usage Provided.`;

	public Module: string = "No Module name Provided";
}

export default BaseCommand;
