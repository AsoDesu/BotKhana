import Client from "../index";

function SetPresence() {
	Client().user.setActivity({ name: `BeatKhana.com`, type: "WATCHING" });
}

export default {
	SetPresence,
};
