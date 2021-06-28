const { v4: uuidv4 } = require("uuid");
import { ConnectCoordinator, DisconnectCoordinator } from "../Types/EventTypes";

class ConnectCoordinatorPacket {
	Size = 0;
	SpecificPacketSize = 0;
	Id = uuidv4();
	From = uuidv4();
	Type = 4;
	SpecificPacket = {};

	constructor(data: DisconnectCoordinator) {
		this.SpecificPacket = {
			ChangedObject: data.SpecificPacket.ChangedObject,
			Type: 4,
		};
	}
}

export default ConnectCoordinatorPacket;
