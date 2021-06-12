import Client from "../index";

function SetPresence() {
	Client().user.setActivity({ name: `${Client().guilds.cache.size} servers`, type: "WATCHING" });
}

export default {
	SetPresence,
};
