import BotLogs from "./BotLogs";

export default (x: string, f: string) => {
	if (!BotLogs.Manager) return;
	return BotLogs.Manager().LogMessage(x, f);
};
