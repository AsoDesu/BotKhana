const { v4: uuidv4 } = require("uuid");
import { ConnectCoordinator } from "../Types/EventTypes";

class ConnectCoordinatorPacket {
	Size = 0;
	SpecificPacketSize = 0;
	Id = uuidv4();
	From = uuidv4();
	Type = 2;
	SpecificPacket = {};

	constructor(data: ConnectCoordinator) {
		this.SpecificPacket = data.SpecificPacket;
	}
}

export default ConnectCoordinatorPacket;
