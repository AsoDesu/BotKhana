import LogChannelManager from "./LogChannelManager";
import Client from "../../index";
import Database from "../../DatabaseManager/DatabaseInit";
import { TextChannel } from "discord.js";

var manager: LogChannelManager;

function GetManager() {
	return manager;
}
function SetManger(m: LogChannelManager) {
	manager = m;
}

async function InitManager() {
	var doc = await Database.collection("settings").doc("logs").get();
	if (!doc.exists) return;
	manager = new LogChannelManager((await Client().channels.fetch(doc.data().channel)) as TextChannel);
}

export default {
	InitManager,
	Manager: GetManager,
	SetManger,
};
