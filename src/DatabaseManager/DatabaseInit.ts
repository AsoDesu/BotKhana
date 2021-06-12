import "dotenv/config";
import firebase from "firebase-admin";

firebase.initializeApp({
	credential: firebase.credential.cert({
		clientEmail: process.env.client_email,
		privateKey: process.env.private_key.replace(/\\n/g, "\n"),
		projectId: process.env.project_id,
	}),
});

var db = firebase.firestore();

export default db;
