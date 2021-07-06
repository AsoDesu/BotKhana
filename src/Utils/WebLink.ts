import Express from "express";
const App = Express();

function CreateWebServer() {
	App.get("/", (req, res) => {
		res.send("Website comming soon!!!!!1");
	});

	App.get("/invite", (req, res) => {
		res.redirect("https://discord.com/api/oauth2/authorize?client_id=796371697083219968&permissions=298265712&scope=bot");
	});

	App.listen(process.env.PORT);
}

export default CreateWebServer;
