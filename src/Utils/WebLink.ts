import Express from "express";
const App = Express();

function CreateWebServer() {
	App.get("/", (req, res) => {
		res.send("Aso was ere.");
	});

	App.listen(process.env.PORT);
}

export default CreateWebServer;
